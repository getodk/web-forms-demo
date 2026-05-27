import { test, expect, Page } from '@playwright/test';
import { PreviewPage } from '../PreviewPage.ts';

test.describe('Note Question Type', () => {
	let form: Page;

	test.beforeEach(async ({ page }) => {
		const previewPage = new PreviewPage(page);
		await previewPage.goToPage();
		form = await previewPage.openPublicDemoForm(
			'All question types',
			'All question types'
		);
	});

	const getInputByLabel = async (label: string) => {
		const input = form.locator(
			`.question-container:has(.control-text label:text("${label}")) input`
		).first();

		await expect(input, `Input for label "${label}" not found`).toBeVisible();
		await input.scrollIntoViewIfNeeded();

		return input;
	}

	const fillAndExpectInputValue = async (label: string, value: string, expectedDisplayedValue: string) => {
		const input = await getInputByLabel(label);
		await input.clear();
		await input.fill(value);

		await expect(input, `Input for label "${label}" does not have expected value`).toHaveValue(
			expectedDisplayedValue
		);
	}

	test('renders all questions', async ({ context }) => {
		await fillAndExpectInputValue('String', '-123.098,56', '-123.098,56');
	});
});
