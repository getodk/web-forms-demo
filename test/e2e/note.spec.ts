import { test, expect, Page } from '@playwright/test';
import { PreviewPage } from '../PreviewPage.ts';

test.describe('Note Question Type', () => {
	let p: Page;

	test.beforeEach(async ({ page }) => {
		p = page;

		const previewPage = new PreviewPage(page);
		await previewPage.goToDevPage();
		await previewPage.openDevDemoForm('notes', '2-all-possible-notes.xml', 'Notes');
	});

	const expectTextAtIndex = async (locator: string, expectedText: string, index: number, expectVisible = true) => {
		const texts = p.locator(locator);
		const text = texts.nth(index).getByText(expectedText, { exact: true });

		if (expectVisible) {
			await text.scrollIntoViewIfNeeded();
			return expect(text).toBeVisible();
		}

		return expect(text).not.toBeVisible();
	}

	const expectText = async (locator: string, expectedText: string) => {
		const text = p.locator(locator).getByText(expectedText, { exact: true });
		await text.scrollIntoViewIfNeeded();
		await expect(text).toBeVisible();
	};

	const expectLabel = async (expectedLabelText: string) => {
		await expectText('.control-text label', expectedLabelText);
	};

	const expectLabelAtIndex = async (expectedLabelText: string, index: number, expectVisible?: boolean) => {
		await expectTextAtIndex('.control-text label', expectedLabelText, index, expectVisible);
	}

	const expectHint = async (expectedHintText: string) => {
		await expectText('.control-text .hint', expectedHintText);
	};

	const expectNoteAtIndex = async (expectedNoteText: string, index: number, expectVisible?: boolean) => {
		await expectTextAtIndex(
			'.note-control .note-value',
			expectedNoteText,
			index,
			expectVisible
		);
	};

	const expectHintAtIndex = async (expectedHintText: string, index: number, expectVisible?: boolean) => {
		await expectTextAtIndex('.control-text .hint', expectedHintText, index, expectVisible);
	};

	const expectGeopointFormattedValue = async (expectedLocation: string[]) => {
		for (const location of expectedLocation) {
			const formattedValue = p
				.locator('.geolocation-formatted-value')
				.getByText(location, { exact: true });
			await expect(formattedValue).toBeVisible();
		}
	};

	test('renders all possible note types', async ({ context }) => {
		await context.setGeolocation({
			latitude: 40.7128,
			longitude: -74.006,
			accuracy: 10,
			altitude: 0,
		});

		await expectLabel(
			"This form illustrates the note concept in ODK. This is not a concept that exists in the underlying ODK XForms spec, it's introduced by XLSForm and discussed informally. Typically a note only has a label."
		);

		await expectLabel('A note with a hint');
		await expectHint('This is a hint');

		// Hint only, no label.
		await expectLabelAtIndex('', 2, false);
		await expectHintAtIndex('Hint-only note', 1);

		await expectLabel('A note with a default value');
		await expectNoteAtIndex('A value', 0);

		await expectLabel('A note with a calculation');
		await expectNoteAtIndex('A value', 1);

		await expectLabel('A readonly integer with value');
		await expectNoteAtIndex('3', 2);

		await expectLabel('A note with decimal type calculated from int');
		await expectNoteAtIndex('4.5', 3);

		await expectLabel('A note with geopoint type');
		await expectGeopointFormattedValue([
			'Accuracy: 150 m,',
			'Latitude: 38.253094215699576,',
			'Longitude: 21.756382658677467.',
		]);
	});
});
