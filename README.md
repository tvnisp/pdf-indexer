# PDF Indexer

The PDF Indexer is a Node.js script that downloads PDF files from Contentful and indexes their content into a JSON file. This README provides an overview of the code structure and its functionality.

## Getting Started
To run the PDF Indexer, follow these steps:

1.  Clone the repository to your local machine.
2.  Create a `.env` file in the project root directory and add your Contentful credentials:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_DELIVERY_ACCESS_TOKEN=your_access_token 
CONTENTFUL_ENVIRONMENT=your_environment 
```
3.  `yarn install`
4. `yarn index-pdf`

## Usage

The PDF Indexer performs the following tasks:

1.  Fetches PDF files from Contentful that have a specified content type.
2.  Converts the fetched PDFs into a structured JSON format.
3.  Downloads the PDF files and parses their content.
4.  Saves the extracted information in a JSON file.
5.  Deletes the downloaded PDF files after indexing.

## Code Overview

### Fetching PDFs from Contentful

The code responsible for fetching PDFs from Contentful is located in the `getPDFs` function. It queries Contentful to retrieve assets with the specified content type and tag. The fetched PDFs are stored in the `items` array, and their details are transformed into a more structured format.

### Converting PDFs to JSON

The main functionality of downloading, parsing, and indexing the PDFs is implemented in the code block following the comment "IIFE." Here's a breakdown of this part of the code:

-   It iterates through the `items` array, representing the PDFs fetched from Contentful.
-   For each PDF, it initiates an HTTP request to download the file.
-   Upon successful download, it parses the downloaded PDF using the `pdf2json` library. It extracts the content and other relevant information.
-   The parsed PDF data is then added to the `pdfs` array, which will be used to create the final JSON output.
-   The downloaded PDF file is deleted to free up storage space.
-   After all PDFs have been processed, the script writes the extracted information to a JSON file named `searchIndexes.json` and deletes the original `PDFInfo.json` file.