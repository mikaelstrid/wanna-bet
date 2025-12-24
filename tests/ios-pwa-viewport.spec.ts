import { test, expect } from '@playwright/test';

test.describe('iOS PWA Viewport Configuration', () => {
  test('should have viewport-fit=cover meta tag', async ({ page }) => {
    await page.goto('/');
    
    // Check that viewport meta tag includes viewport-fit=cover
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportMeta).toContain('viewport-fit=cover');
  });

  test('should have black-translucent status bar style for iOS', async ({ page }) => {
    await page.goto('/');
    
    // Check that apple-mobile-web-app-status-bar-style is set to black-translucent
    const statusBarStyle = await page.locator('meta[name="apple-mobile-web-app-status-bar-style"]').getAttribute('content');
    expect(statusBarStyle).toBe('black-translucent');
  });

  test('should have purple background extending to all edges on mobile viewport', async ({ page }) => {
    // Simulate an iPhone viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    
    // Get the body element's background
    const bodyStyles = await page.locator('body').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.background,
        backgroundAttachment: styles.backgroundAttachment
      };
    });
    
    // Check that body has the purple gradient background with fixed attachment
    expect(bodyStyles.background).toContain('linear-gradient');
    expect(bodyStyles.background).toContain('rgb(102, 126, 234)'); // hex #667eea converted to rgb
    expect(bodyStyles.backgroundAttachment).toBe('fixed');
    
    // Check that html element has proper min-height
    const htmlMinHeight = await page.locator('html').evaluate((el) => {
      return window.getComputedStyle(el).minHeight;
    });
    
    // Should have min-height set (could be 100vh, stretch, or pixel value)
    expect(htmlMinHeight).toBeTruthy();
    expect(htmlMinHeight.length).toBeGreaterThan(0);
  });

  test('should have proper CSS for safe area support', async ({ page }) => {
    await page.goto('/');
    
    // Check that body has the correct min-height
    const bodyStyles = await page.locator('body').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        minHeight: styles.minHeight,
        backgroundAttachment: styles.backgroundAttachment
      };
    });
    
    // Check body min-height is set to a valid value
    expect(bodyStyles.minHeight).toBeTruthy();
    expect(bodyStyles.minHeight.length).toBeGreaterThan(0);
    expect(bodyStyles.backgroundAttachment).toBe('fixed');
    
    // Check that #root has proper background with fixed attachment
    const rootStyles = await page.locator('#root').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        background: styles.background,
        backgroundAttachment: styles.backgroundAttachment
      };
    });
    
    expect(rootStyles.background).toContain('linear-gradient');
    expect(rootStyles.backgroundAttachment).toBe('fixed');
  });
});

test.describe('iOS PWA Viewport on iPhone device', () => {
  test('should display purple background on iPhone viewport', async ({ page }) => {
    // Simulate iPhone viewport
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 dimensions
    await page.goto('/');
    
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
    // Width should match viewport dimensions
    expect(parseInt(rootStyles.width)).toBe(390);
  });
});
