import ts from 'typescript';
import fs from 'node:fs';

// One-time migration of rendered text; data, URLs and code remain untouched.
const files = ['src/App.tsx', 'src/components/CaseStudyModal.tsx', 'src/components/AiDevTerminal.tsx'];
const decode = text => text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  if (source.includes('t as translateText')) continue;
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  function walk(node, skip = false) {
    if (ts.isJsxElement(node)) skip ||= ['pre', 'code', 'svg'].includes(node.openingElement.tagName.getText(tree));
    if (!skip && ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) {
      const lines = node.text.split(/\r?\n/).map((line, index, all) => {
        let value = line.replace(/\t/g, ' ');
        if (index > 0) value = value.trimStart();
        if (index < all.length - 1) value = value.trimEnd();
        return value;
      }).filter(Boolean);
      edits.push([node.pos, node.end, `{translateText(${JSON.stringify(decode(lines.join(' ')))})}`]);
    } else if (!skip && ts.isJsxExpression(node) && !ts.isJsxAttribute(node.parent) && node.expression) {
      const expr = node.expression;
      if (ts.isIdentifier(expr) || ts.isPropertyAccessExpression(expr) || ts.isConditionalExpression(expr) || ts.isTemplateExpression(expr)) {
        edits.push([expr.getStart(tree), expr.end, `translateText(${expr.getText(tree)})`]);
        return;
      }
    } else if (ts.isJsxAttribute(node) && ['aria-label', 'placeholder', 'title', 'alt'].includes(node.name.getText(tree)) && node.initializer) {
      const init = node.initializer;
      if (ts.isStringLiteral(init)) edits.push([init.getStart(tree), init.end, `{translateText(${JSON.stringify(decode(init.text))})}`]);
      else if (ts.isJsxExpression(init) && init.expression) edits.push([init.expression.getStart(tree), init.expression.end, `translateText(${init.expression.getText(tree)})`]);
      return;
    }
    ts.forEachChild(node, child => walk(child, skip));
  }
  walk(tree);
  for (const [start, end, replacement] of edits.sort((a, b) => b[0] - a[0])) source = source.slice(0, start) + replacement + source.slice(end);
  fs.writeFileSync(file, `import { t as translateText } from '${file === 'src/App.tsx' ? './i18n' : '../i18n'}';\n` + source);
}
