import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const page: number = req.query.page || 1;

  const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  res.send(paginatedData);
const sort = (data: Ticket[], by: SortCriteria, dir: SortDirection) => {
	interface mapper {
		[key: string]: string;
	}

	const mapToKey: mapper = {date: 'creationTime', email: 'userEmail', title: 'title'};
	const key = mapToKey[by];
    if(key) {
		data.sort((a: Ticket, b: Ticket): number => {
			// @ts-ignore
			return  dir === 'ASC' ? (a[key] < b[key]  ? -1 : 0) : (a[key] > b[key] ? -1 : 0)
		});
	}
};

app.get('/api/tickets', (req, res) => {
    const page = req.query.page || 1;
    const sortBy = req.query.sortBy || '';
	const direction = req.query.sortDir || '';
	if(sortBy){
		 sort(tempData, sortBy, direction);
	}
    const paginatedData = tempData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    res.send(paginatedData);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

