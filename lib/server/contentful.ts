import {createClient} from 'contentful';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID as string, // ID of a Compose-compatible space to be used \
	accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN as string, // delivery API key for the space \
	environment: process.env.CONTENTFUL_ENVIRONMENT as string,
});

const getClient = () => client;

export async function getPDFs() {
	const query = {
		'fields.file.contentType': 'application/pdf',
		'metadata.tags.sys.id[in]': process.env.CONTENTFUL_WOWWAY_TAG as string,
		include: 10,
	};
	const {items} = await getClient().getAssets(query);
	return items;
}
