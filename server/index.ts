import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { Ticket, TicketsR } from '../client/src/api';


console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;
const LastPage = tempData.length/PAGE_SIZE;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {

  // @ts-ignore
  const searchBarInput: string = req.query.searchBarInput; 
  const page: number = req.query.page || 1;

  let paginatedData: Ticket[] = tempData; 

  //for searching in the whole data and not just 1 page (task 2.a)
  if(searchBarInput !== ""){ //
     paginatedData = paginatedData.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(searchBarInput.toLowerCase()));    
  }
  else{
     paginatedData = paginatedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }
  
  const serverR: TicketsR = {tickets: paginatedData, lastPage:LastPage}

  res.send(serverR);
});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)


