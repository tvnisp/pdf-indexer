import fs from 'fs/promises';
import {getLogger} from '../../lib/server/util/logger';
import {getPDFs} from '../../lib/server/contentful';

(async () => {
	try {
		const PDFs = await getPDFs();
		const items = PDFs.map(pdf => {
			const {url} = pdf.fields.file;
			const fileName = pdf.fields.title
				.replace(/ /g, '-')
				.replace(/\//g, '-');
			return {url: `http:${url}`, fileName};
		});

		await fs.writeFile(
			'scripts/pdfIndexer/PDFInfo.json',
			JSON.stringify({items})
		);

		getLogger({name: 'extractPdfInfoLogger'}).info('Created PDFInfo.json');
	} catch (error) {
		console.error(error);
	}
})();
