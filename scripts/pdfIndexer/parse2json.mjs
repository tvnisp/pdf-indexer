// Import dependencies
import fs from 'fs';
import http from 'http';
import PDFParser from 'pdf2json';

// Get all the files from the auto-generated json file from contentful
const PDFInfo = fs.readFileSync('scripts/pdfIndexer/PDFInfo.json');
const {items} = JSON.parse(PDFInfo);
const pdfs = [];

async function parse({url, fileName}) {
	// Set up the pdf parser
	const pdfParser = new PDFParser(this, 1);

	// Load the pdf document
	pdfParser.loadPDF(`./scripts/pdfIndexer/pdfs/${fileName}`);

	// Parsed the pdf
	const pdf = await new Promise(resolve => {
		// On data ready
		pdfParser.on('pdfParser_dataReady', () => {
			// The raw PDF data in text form
			const raw = pdfParser
				.getRawTextContent()
				.replace(/\r\n/g, ' ')
				.replace(
					/----------------Page \(\d+\) Break----------------/gm,
					' '
				);
			// Return the parsed data
			resolve({
				fileName,
				url,
				content: raw,
			});
		});
	});

	// Add the pdf to the pdfs array
	pdfs.push(pdf);
	fs.unlink(`./scripts/pdfIndexer/pdfs/${fileName}`, () => {
		console.log(`PDF ${fileName} deleted after indexed`);
	});
}

// IIFE
(async () => {
	Promise.all(
		items.map(async item => {
			await new Promise(res => {
				const file = fs.createWriteStream(
					`./scripts/pdfIndexer/pdfs/${item.fileName}`
				);

				http.get(item.url, response => {
					response.pipe(file);

					// after download completed close filestream
					file.on('finish', () => {
						file.close();
						res({
							url: item.url,
							fileName: item.fileName,
						});
						console.log(`PDF ${item.fileName} downloaded`);
					});
				});
			}).then(pdf => parse(pdf));
		})
	).then(() => {
		// Save the extracted information to a json file
		fs.writeFileSync(
			'scripts/pdfIndexer/jsons/searchIndexes.json',
			JSON.stringify({pdfs})
		);
		console.log('Created searchIndexes.json');
		fs.unlink('scripts/pdfIndexer/PDFInfo.json', () => {
			console.log('PDFInfo.json deleted after pdfs indexed');
		});
	});
})();
