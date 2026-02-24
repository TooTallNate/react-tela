import { describe, expect, it } from 'vitest';
import { formatFontFamily } from '../src/text.js';

describe('formatFontFamily', () => {
	describe('string input', () => {
		it('should not quote a single name without spaces', () => {
			expect(formatFontFamily('Arial')).toBe('Arial');
		});

		it('should not quote a single generic family name', () => {
			expect(formatFontFamily('sans-serif')).toBe('sans-serif');
		});

		it('should quote a single name with spaces', () => {
			expect(formatFontFamily('Geist Sans')).toBe('"Geist Sans"');
		});

		it('should pass through comma-delimited list as-is', () => {
			expect(formatFontFamily('Arial, Helvetica, sans-serif')).toBe(
				'Arial, Helvetica, sans-serif',
			);
		});

		it('should pass through comma-delimited list with quoted names as-is', () => {
			expect(formatFontFamily("'Geist Sans', sans-serif")).toBe(
				"'Geist Sans', sans-serif",
			);
		});
	});

	describe('array input', () => {
		it('should join entries with comma and space', () => {
			expect(formatFontFamily(['Arial', 'Helvetica', 'sans-serif'])).toBe(
				'Arial, Helvetica, sans-serif',
			);
		});

		it('should quote entries that contain spaces', () => {
			expect(formatFontFamily(['Geist Sans', 'sans-serif'])).toBe(
				'"Geist Sans", sans-serif',
			);
		});

		it('should not quote entries without spaces', () => {
			expect(formatFontFamily(['monospace'])).toBe('monospace');
		});

		it('should handle a single entry with spaces', () => {
			expect(formatFontFamily(['Times New Roman'])).toBe('"Times New Roman"');
		});
	});
});
