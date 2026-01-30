#!/bin/bash

# Genki Site Switcher
# ------------------
# Easily toggle between Coming Soon and Full Site
#
# Usage:
#   ./switch-site.sh soon     - Switch to Coming Soon page
#   ./switch-site.sh full     - Switch to Full Site
#   ./switch-site.sh status   - Check which version is currently active

cd "$(dirname "$0")"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

case "$1" in
  soon|coming|maintenance)
    if [ -f "index-coming-soon.html" ]; then
      cp index.html index-main.html 2>/dev/null
      cp index-coming-soon.html index.html
      echo -e "${GREEN}✓ Switched to COMING SOON page${NC}"
      echo "  Visitors will now see the coming soon page."
    else
      echo -e "${YELLOW}Coming soon page not found.${NC}"
      echo "  Make sure index-coming-soon.html exists."
    fi
    ;;

  full|main|live)
    if [ -f "index-main.html" ]; then
      cp index.html index-coming-soon.html 2>/dev/null
      cp index-main.html index.html
      echo -e "${GREEN}✓ Switched to FULL SITE${NC}"
      echo "  Visitors will now see the complete website."
    else
      echo -e "${YELLOW}Main site not found.${NC}"
      echo "  Make sure index-main.html exists."
    fi
    ;;

  status|check)
    echo -e "${BLUE}Checking current site status...${NC}"
    echo ""
    if grep -q "Something Healthy Is Coming" index.html 2>/dev/null; then
      echo -e "  Current: ${YELLOW}COMING SOON${NC} page"
    else
      echo -e "  Current: ${GREEN}FULL SITE${NC}"
    fi
    echo ""
    echo "  Available files:"
    [ -f "index.html" ] && echo "    ✓ index.html"
    [ -f "index-main.html" ] && echo "    ✓ index-main.html (full site backup)"
    [ -f "index-coming-soon.html" ] && echo "    ✓ index-coming-soon.html (coming soon backup)"
    ;;

  *)
    echo ""
    echo -e "${BLUE}Genki Site Switcher${NC}"
    echo "===================="
    echo ""
    echo "Usage:"
    echo "  ./switch-site.sh soon    - Activate Coming Soon page"
    echo "  ./switch-site.sh full    - Activate Full Site"
    echo "  ./switch-site.sh status  - Check current status"
    echo ""
    ;;
esac
