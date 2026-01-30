#!/bin/bash

# Genki Site Switcher
# ------------------
# Easily toggle between Coming Soon and Full Site
#
# Usage:
#   ./switch-site.sh soon     - Switch to Coming Soon page (all pages redirect)
#   ./switch-site.sh full     - Switch to Full Site (remove redirects)
#   ./switch-site.sh status   - Check which version is currently active

cd "$(dirname "$0")"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Redirect line to add/remove
REDIRECT_COMMENT="  <!-- COMING SOON REDIRECT - Remove this line when site is live -->"
REDIRECT_SCRIPT="  <script>window.location.href = 'index.html';</script>"

# Pages to manage (excluding index.html)
PAGES=("products.html" "companies.html" "mission.html" "contact.html")

add_redirects() {
  for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
      # Check if redirect already exists
      if ! grep -q "COMING SOON REDIRECT" "$page"; then
        # Add redirect after <head>
        sed -i '' 's|<head>|<head>\
  <!-- COMING SOON REDIRECT - Remove this line when site is live -->\
  <script>window.location.href = '"'"'index.html'"'"';</script>|' "$page"
        echo "  Added redirect to $page"
      fi
    fi
  done
}

remove_redirects() {
  for page in "${PAGES[@]}"; do
    if [ -f "$page" ]; then
      # Remove the redirect comment and script lines
      sed -i '' '/COMING SOON REDIRECT/d' "$page"
      sed -i '' '/window\.location\.href.*index\.html/d' "$page"
      echo "  Removed redirect from $page"
    fi
  done
}

case "$1" in
  soon|coming|maintenance)
    # Switch index to coming soon
    if [ -f "index-coming-soon.html" ]; then
      cp index.html index-main.html 2>/dev/null
      cp index-coming-soon.html index.html
    fi

    # Add redirects to all other pages
    add_redirects

    echo ""
    echo -e "${GREEN}✓ COMING SOON MODE ACTIVATED${NC}"
    echo ""
    echo "  • Homepage shows Coming Soon page"
    echo "  • All other pages redirect to Coming Soon"
    echo ""
    echo -e "${YELLOW}Don't forget to push changes:${NC}"
    echo "  git add -A && git commit -m 'Enable coming soon mode' && git push"
    echo ""
    ;;

  full|main|live)
    # Switch index to full site
    if [ -f "index-main.html" ]; then
      cp index.html index-coming-soon.html 2>/dev/null
      cp index-main.html index.html
    fi

    # Remove redirects from all pages
    remove_redirects

    echo ""
    echo -e "${GREEN}✓ FULL SITE MODE ACTIVATED${NC}"
    echo ""
    echo "  • Homepage shows full website"
    echo "  • All pages accessible normally"
    echo ""
    echo -e "${YELLOW}Don't forget to push changes:${NC}"
    echo "  git add -A && git commit -m 'Enable full site' && git push"
    echo ""
    ;;

  status|check)
    echo ""
    echo -e "${BLUE}Current Site Status${NC}"
    echo "==================="
    echo ""

    # Check index
    if grep -q "Something Healthy Is Coming" index.html 2>/dev/null; then
      echo -e "  Homepage: ${YELLOW}COMING SOON${NC}"
    else
      echo -e "  Homepage: ${GREEN}FULL SITE${NC}"
    fi

    # Check redirects
    redirect_count=0
    for page in "${PAGES[@]}"; do
      if grep -q "COMING SOON REDIRECT" "$page" 2>/dev/null; then
        ((redirect_count++))
      fi
    done

    if [ $redirect_count -eq ${#PAGES[@]} ]; then
      echo -e "  Other pages: ${YELLOW}REDIRECTING${NC} to Coming Soon"
    elif [ $redirect_count -eq 0 ]; then
      echo -e "  Other pages: ${GREEN}ACCESSIBLE${NC}"
    else
      echo -e "  Other pages: ${RED}MIXED${NC} ($redirect_count/${#PAGES[@]} redirecting)"
    fi

    echo ""
    echo "  Files:"
    [ -f "index.html" ] && echo "    ✓ index.html"
    [ -f "index-main.html" ] && echo "    ✓ index-main.html (full site backup)"
    [ -f "index-coming-soon.html" ] && echo "    ✓ index-coming-soon.html (coming soon backup)"
    echo ""
    ;;

  *)
    echo ""
    echo -e "${BLUE}Genki Site Switcher${NC}"
    echo "===================="
    echo ""
    echo "Usage:"
    echo -e "  ./switch-site.sh ${YELLOW}soon${NC}     Activate Coming Soon (redirects all pages)"
    echo -e "  ./switch-site.sh ${GREEN}full${NC}     Activate Full Site (removes redirects)"
    echo -e "  ./switch-site.sh ${BLUE}status${NC}   Check current status"
    echo ""
    ;;
esac
