import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Pattern to extract the media queries block that is wrongly placed
pattern = re.compile(r'(@media \(max-width: 768px\) \{\s*\.catalog-items-grid \{\s*grid-template-columns: repeat\(3, 1fr\);\s*\}\s*\}\s*@media \(max-width: 768px\) \{\s*\.catalog-items-grid \{\s*grid-template-columns: repeat\(2, 1fr\);\s*\}\s*\}\s*@media \(max-width: 480px\) \{.*?\n\}\n)', re.DOTALL)

match = pattern.search(css)
if match:
    block = match.group(1)
    # Remove block
    css = css.replace(block, '')
    
    # Clean up the block (remove duplicate 768 and add img rule)
    clean_block = '''@media (max-width: 768px) {
  .catalog-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .catalog-items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    padding: 0.25rem;
  }
  
  .catalog-card {
    padding: 0.5rem;
    border-radius: 0.5rem;
    height: auto;
  }

  .card-img-wrapper {
    height: 90px !important;
    margin-bottom: 0.25rem;
    padding: 0;
    border: none;
    border-radius: 0;
  }

  .card-img-wrapper img {
    max-height: 100% !important;
    max-width: 100% !important;
  }

  .card-title {
    font-size: 0.75rem;
    line-height: 1.1;
    margin-bottom: 0.2rem;
  }

  .card-rating {
    font-size: 0.65rem;
    margin-bottom: 0.2rem;
  }

  .price-current {
    font-size: 0.85rem;
  }
  
  .price-current span {
    display: block;
    font-size: 0.65em;
  }

  .cart-btn {
    width: 28px;
    height: 28px;
    padding: 4px;
  }
  
  .card-badges {
    margin-bottom: 0.5rem;
  }
  
  .badge {
    font-size: 0.6rem;
    padding: 0.15rem 0.35rem;
  }
}

'''
    
    # insert before wave animations
    css = css.replace('/* Wave animations for mobile hero background */', clean_block + '/* Wave animations for mobile hero background */')
    
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('Fixed CSS media query order')
else:
    print('Pattern not found')
