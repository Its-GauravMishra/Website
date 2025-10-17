# RR Industries - Corporate Website

A production-quality, responsive corporate website for RR Industries, manufacturers of Earthing Electrodes & Earthing Compounds.

## Features

- 🎨 **Modern Design**: Clean, professional design with RR Industries branding (#B00020 primary color)
- 📱 **Fully Responsive**: Mobile-first design supporting 360px to 1440px+ screens
- ⚡ **Pure Vanilla JS**: No frameworks, no build tools - just HTML5, CSS3, and ES6 JavaScript
- ♿ **Accessible**: WCAG compliant with semantic HTML, keyboard navigation, and screen reader support
- 🔍 **SEO Optimized**: Meta tags, OpenGraph, and semantic structure for better search visibility
- 🎭 **Smooth Animations**: CSS transitions and IntersectionObserver-based scroll reveals
- ✅ **ISO Certified**: Showcasing ISO 9001:2015, NABL, ROHS, MSME, ISI certifications

## Pages

- **Home** (`index.html`) - Hero section, product carousel, company USPs
- **About** (`about.html`) - Company story, timeline, quality promise
- **Products** (`products.html`) - Filterable product catalog with detailed specifications
- **Technical** (`technical.html`) - Installation guides, soil pH guidance, specifications
- **Certifications** (`certifications.html`) - ISO, NABL, ROHS, MSME certifications
- **Contact** (`contact.html`) - Contact form, location, business hours

## Technology Stack

- HTML5 (Semantic markup)
- CSS3 (Custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Montserrat, Inter)

## Product Range

1. **GI Earthing Electrode** - Hot-dip galvanized corrosion protection
2. **Pure Copper Earthing Electrode** - 100% copper for maximum conductivity
3. **Copper Bonded Earthing Rod** - Steel core with 99.9% copper coating
4. **GI Copper Terminal Electrode** - Enhanced GI with copper terminal
5. **Earthing Compound** - 25 kg moisture-retaining formula

## Setup & Deployment

### Local Development

Simply open `index.html` in a web browser. No build process required!

For a local server (recommended):
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

Then visit `http://localhost:8000`

### Production Deployment

Upload all files to your web hosting:
- All HTML files (root directory)
- `/assets/css/` - Stylesheets
- `/assets/js/` - JavaScript files
- `/assets/img/` - Images (add your product photos, logos, certificates)

### Adding Images

Replace placeholder images in `/assets/img/`:
- `favicon.png` - Website favicon (32x32px recommended)
- Product photos for each electrode type
- Company logo
- Certification badges (ISO, NABL, etc.)
- Team/facility photos

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
Edit CSS custom properties in `/assets/css/style.css`:
```css
:root {
  --color-primary: #B00020;
  --color-accent-gold: #F9C400;
  /* ... */
}
```

### Content
All content is in the HTML files - no CMS required. Simply edit the HTML directly.

### Forms
Contact form currently uses client-side validation with console logging. Update `/assets/js/site.js` to integrate with your backend API or email service.

## Contact Information

**RR Industries**
- Email: rrindustries955@gmail.com
- Phone: +91-8756733434, +91-8126561019
- Address: 128/2B, Flat No. 204, Saraswati Apartment, K Block, Kidwai Nagar, Kanpur (U.P.)-208011
- Website: rrindustriesmanufacturing.co.in

## Tagline

*"Your Safety Is Our Responsibility — Low Resistance"*

**India's No.1 Unique Earthing Company**

---

© 2024 RR Industries. All rights reserved.