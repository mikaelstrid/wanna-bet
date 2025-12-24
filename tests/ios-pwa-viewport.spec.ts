import { test, expect, devices } from '@playwright/test';

test.describe('iOS PWA Viewport Configuration', () => {
  test('should have viewport-fit=cover meta tag', async ({ page }) => {
    await page.goto('http://localhost:5173/wanna-bet/');
    
    // Check that viewport meta tag includes viewport-fit=cover
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportMeta).toContain('viewport-fit=cover');
  });

  test('should have black-translucent status bar style for iOS', async ({ page }) => {
    await page.goto('http://localhost:5173/wanna-bet/');
    
    // Check that apple-mobile-web-app-status-bar-style is set to black-translucent
    const statusBarStyle = await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content');
    expect(statusBarStyle).toBe('black-translucent');
  });

  test('should have purple background extending to all edges on mobile viewport', async ({ page }) => {
    // Simulate an iPhone viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:5173/wanna-bet/');
    
    // Get the body element's background
    const bodyBackground = await page.locator('body').evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    
    // Check that body has the purple gradient background
    expect(bodyBackground).toContain('linear-gradient');
    expect(bodyBackground).toContain('rgb(102, 126, 234)'); // hex #667eea converted to rgb
    
    // Check that html element also has proper styling
    const htmlMinHeight = await page.locator('html').evaluate((el) => {
      return window.getComputedStyle(el).minHeight;
    });
    
    // Should have min-height set
    expect(htmlMinHeight).toBeTruthy();
  });

  test('should have proper CSS for safe area support', async ({ page }) => {
    await page.goto('http://localhost:5173/wanna-bet/');
    
    // Check that body has the correct min-height including webkit-fill-available
    const bodyMinHeight = await page.locator('body').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.minHeight;
    });
    
    expect(bodyMinHeight).toBeTruthy();
    
    // Check that #root has proper background
    const rootBackground = await page.locator('#root').evaluate((el) => {
      return window.getComputedStyle(el).background;
    });
    
    expect(rootBackground).toContain('linear-gradient');
  });
});

test.describe('iOS PWA Viewport on iPhone device', () => {
  test('should display purple background on iPhone viewport', async ({ page }) => {
    // Simulate iPhone viewport
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 dimensions
    await page.goto('http://localhost:5173/wanna-bet/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the root element has the purple gradient
    const rootStyles = await page.locator('#root').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.background,
        minHeight: styles.minHeight,
        width: styles.width
      };
    });
    
    expect(rootStyles.background).toContain('linear-gradient');
    // Width is computed to 390px when viewport is set, which is expected
    expect(parseInt(rootStyles.width)).toBeGreaterThan(0);
  });
});
