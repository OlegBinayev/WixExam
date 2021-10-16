import axios from 'axios';
import {APIRootPath} from '@fed-exam/config';

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type GetTicketParams = {  
    page: number;
    searchBarInput: string;
}

export type TicketsR = {   // we need to know how many pages we will have, for the next button
    tickets: Ticket[],
    lastPage: number
}


export type ApiClient = {
    getTickets: (params:GetTicketParams) => Promise<TicketsR>; 
    
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (params:GetTicketParams) => {
            return axios.get(APIRootPath,{params:params}).then((res) => res.data);
        }
    }
}
