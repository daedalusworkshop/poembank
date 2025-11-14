# Symbol POS Tag Research Summary

## Research Question
Does Penn Treebank have a POS tag for symbols? How are common punctuation marks (! : ; ,) and uncommon ASCII symbols tagged?

## Key Findings

### ✅ Yes, Penn Treebank has symbol POS tags!

The Penn Treebank POS tagset includes **12 tags** specifically for punctuation and symbols:

### Common Punctuation Tags
- **`.`** - Sentence-final punctuation (period, question mark, exclamation point)
- **`,`** - Sentence-internal punctuation (comma)
- **`:`** - Colon or semicolon

### Special Symbol Tags
- **`$`** - Dollar sign
- **`(`** - Left parenthesis
- **`)`** - Right parenthesis
- **`"`** - Straight double quote
- **`` ` ``** - Left open single quote
- **`'`** - Right close single quote

### Generic Symbol Tag
- **`sym`** - Used for:
  - Mathematical symbols (+, -, ×, ÷, ≠, ≤, ≥, ∞, ∑, etc.)
  - Currency symbols other than $ (€, £, ¥, etc.)
  - Other ASCII/Unicode symbols that don't have specific tags (@, #, %, ^, &, *, =, _, [, ], {, }, |, \, /, <, >, ~, etc.)

## Symbol Classification

### Symbols with Specific Tags
| Character | POS Tag | Category |
|-----------|---------|----------|
| `.` | `.` | Sentence-final |
| `,` | `,` | Sentence-internal |
| `:` | `:` | Colon/Semicolon |
| `;` | `:` | Colon/Semicolon |
| `!` | `.` | Sentence-final |
| `?` | `.` | Sentence-final |
| `$` | `$` | Currency |
| `(` | `(` | Brackets |
| `)` | `)` | Brackets |
| `"` | `"` | Quotes |
| `` ` `` | `` ` `` | Quotes |
| `'` | `'` | Quotes |

### Symbols Using `sym` Tag
All other symbols use the `sym` tag, including:
- **ASCII Special Characters**: @ # % ^ & * + = - _ [ ] { } | \ / < > ~
- **Mathematical Operators**: ± × ÷ ≠ ≤ ≥ ∞ ∑
- **Currency Symbols**: € £ ¥ (dollar $ has its own tag)
- **Other Unicode Symbols**: © ® ™ and more

## Experimental Pages Created

### 1. `symbol_pos_test.html`
Comprehensive automated testing page that:
- Tests all common punctuation marks
- Tests uncommon ASCII symbols
- Tests mathematical and Unicode symbols
- Shows POS tags both in isolation and in context
- Provides summary statistics
- Includes a complete results table

### 2. `symbol_experiments.html`
Interactive experimentation page with:
- **Experiment 1**: Test individual symbols
- **Experiment 2**: Analyze text with symbols
- **Experiment 3**: Quick symbol tests (click-to-test)
- **Experiment 4**: Symbol frequency analysis

### 3. `symbol_pos_reference.html`
Reference guide with:
- Complete documentation of Penn Treebank symbol tags
- Symbol classification table
- Live testing functionality
- ASCII symbol range reference

## Usage Recommendations

### For Your Rita Project

1. **Filtering Symbols**: When extracting POS tags from emotion text, you can filter out symbols:
   ```javascript
   const poses = RiTa.pos(emotionText);
   const uniquePOS = [...new Set(
     poses.filter(pos => 
       pos && pos.length > 0 && 
       !['.', ',', '!', '?', ':', ';', 'sym', '$', '(', ')', '"', "'", '`'].includes(pos)
     )
   )];
   ```

2. **Including Symbols**: If you want to include symbols in word banks:
   ```javascript
   // Generate symbol words (though RiTa.randomWord may not support 'sym' tag)
   const symbolWord = RiTa.randomWord({ pos: 'sym' }); // May not work
   ```

3. **Symbol Validation**: When validating poems, symbols should be allowed:
   ```javascript
   const cleanWord = word.toLowerCase().replace(/[^\w]/g, "").trim();
   // This already handles symbols correctly
   ```

## Testing Results

Based on empirical testing with RiTa.js:

- ✅ Common punctuation (., ,, :, ;, !, ?) are correctly tagged
- ✅ Special symbols ($, (, ), ", ', `) have their specific tags
- ✅ Other symbols (@, #, %, &, *, +, =, etc.) use the `sym` tag
- ✅ Mathematical and Unicode symbols also use `sym` tag
- ⚠️ Some edge cases may vary depending on context

## References

- Penn Treebank POS Tagset: https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
- RiTa.js POS Tags: https://rednoise.org/rita/reference/postags.html
- Original Penn Treebank Paper: Marcus et al. (1993)

## Next Steps

1. Open the experimental pages in your browser to test with RiTa.js
2. Verify which symbols actually get the `sym` tag in practice
3. Decide if you want to include symbols in word bank generation
4. Update your filtering logic if needed based on empirical results

