# MDX Syntax Guide for Case Studies

## Common Errors and How to Fix Them

### 1. **Curly Braces `{` `}` Must Be Escaped**

MDX treats curly braces as JavaScript expressions. If you want to display them literally, escape them with backslashes or use HTML entities.

**❌ Wrong:**
```markdown
I used {variables} in my code.
```

**✅ Correct:**
```markdown
I used \{variables\} in my code.
<!-- OR -->
I used &#123;variables&#125; in my code.
```

### 2. **Angle Brackets in Text**

Be careful with `<` and `>` in regular text - they can be interpreted as HTML/JSX tags.

**❌ Wrong:**
```markdown
The performance improved from <100ms to >200ms.
```

**✅ Correct:**
```markdown
The performance improved from \<100ms to \>200ms.
<!-- OR -->
The performance improved from &lt;100ms to &gt;200ms.
```

### 3. **Code Blocks Are Safe**

Content inside code blocks (triple backticks) doesn't need escaping:

**✅ Correct:**
````markdown
```javascript
const obj = { key: "value" };
if (x < 10) {
  // This is fine
}
```
````

### 4. **HTML/JSX Must Be Valid**

If you use HTML tags, they must be properly closed:

**❌ Wrong:**
```markdown
<div>Some content
```

**✅ Correct:**
```markdown
<div>Some content</div>
```

### 5. **Lists Need Proper Spacing**

Ensure proper spacing around lists:

**❌ Wrong:**
```markdown
Some text
- Item 1
- Item 2
```

**✅ Correct:**
```markdown
Some text

- Item 1
- Item 2
```

## Safe Markdown Syntax

### Headings
```markdown
# H1
## H2
### H3
```

### Paragraphs
```markdown
Just write normal text. Separate paragraphs with blank lines.

Like this.
```

### Lists
```markdown
- Unordered item 1
- Unordered item 2

1. Ordered item 1
2. Ordered item 2
```

### Links
```markdown
[Link text](https://example.com)
```

### Images
```markdown
![Alt text](https://example.com/image.jpg)
```

### Bold and Italic
```markdown
**bold text**
*italic text*
***bold and italic***
```

### Code
```markdown
Inline `code` here

```javascript
// Code block
function example() {
  return true;
}
```
```

### Blockquotes
```markdown
> This is a quote
> It can span multiple lines
```

### Tables
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Horizontal Rules
```markdown
---
```

## Common Pitfalls

### JavaScript/Code Examples
When showing JavaScript objects or code with curly braces in regular text:

**❌ Wrong:**
```markdown
The API returns {status: 200, data: {...}}
```

**✅ Correct - Put it in a code block:**
````markdown
The API returns:

```json
{
  "status": 200,
  "data": {...}
}
```
````

**✅ Also Correct - Escape in inline code:**
```markdown
The API returns `{status: 200, data: {...}}`
```

### Mathematical Expressions
**❌ Wrong:**
```markdown
The range is {x | x > 0}
```

**✅ Correct:**
```markdown
The range is \{x | x > 0\}
```

### Template Literals
**❌ Wrong:**
```markdown
I used template strings like ${variable}
```

**✅ Correct:**
```markdown
I used template strings like `${variable}` (in code block or inline code)
```

## Testing Your MDX

Before saving, make sure:
1. All curly braces `{ }` in regular text are escaped or in code blocks
2. All angle brackets `< >` in regular text are escaped
3. All HTML tags are properly closed
4. Lists have blank lines before and after
5. Code blocks use triple backticks

## Quick Fix Checklist

If you get an MDX parsing error:
1. ✅ Check for `{` or `}` in regular text - escape them as `\{` or `\}`
2. ✅ Check for `<` or `>` in regular text - escape them or use code blocks
3. ✅ Ensure all HTML tags are properly closed
4. ✅ Check for proper spacing around lists and code blocks
5. ✅ Make sure code blocks use triple backticks (```)

## Need Help?

If you're still getting errors:
1. Copy your content to a plain text editor
2. Search for `{`, `}`, `<`, `>` characters outside of code blocks
3. Either escape them with backslashes or put them in code blocks
4. Save and try again



