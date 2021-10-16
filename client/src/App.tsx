import React from 'react';
import './App.scss';
import {createApiClient, GetTicketParams, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	page:number,
	hiddenTickets: any[],
	showRestore: any,
	PinnedTickets: any[],	
	lastPage: number,	//we want to limit our pages for the next page button

}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
	

	state: AppState = {
		search: '',
		page:1,
		hiddenTickets:[],
		showRestore : false,
		PinnedTickets: [],
		lastPage: 0,
	};

	deletedTickets = 0;
	searchDebounce: any = null;

	async componentDidMount() {
		const TicketParams: GetTicketParams = {
			page : this.state.page,
			searchBarInput : this.state.search,

		}

		const res = await api.getTickets(TicketParams)

		this.setState({
			tickets: res.tickets,
			lastPage:res.lastPage
		});
	}

	hideTicketOnClick = (id:string) => {      //hiding the tickets after Hide button pressed (task 1.b)	 
		if (this.state.tickets) {
			this.setState( {
				tickets: [...this.state.tickets.filter(ticket => ticket.id !== id)], // remove the ticket we hide from page
				hiddenTickets: [...this.state.hiddenTickets, this.state.tickets.find(ticket => ticket.id === id)]  //store the hidden data in the hiidenTickets array
			})
			this.state.showRestore=true;
		}	
	}

	restoreTicketsOnClick = () =>{        //Restoring all the hidden data  (task 1.b)
		if (this.state.tickets) {
			this.setState({
				tickets: [...this.state.hiddenTickets,...this.state.tickets], //combine the hidden and original arrays
				hiddenTickets: []
			})
			this.state.showRestore=false;
		}
	}

	nextPage =()=>{      //go to the next 20 tickets  (task 2.b)

		if(this.state.page<this.state.lastPage){
			this.state.hiddenTickets.length = 0   //i have decided to reset the hidden array after switching page 
			this.state.page ++;
			this.componentDidMount()
			window.scrollTo(0, 0)
			this.state.showRestore = false;
		}
	}

	prevPage =()=>{        //go to previos 20 tickets (task 2.b)
		if(this.state.page>1)
		{
			this.state.page --;
			this.componentDidMount()
			window.scrollTo(0, 0)
			this.state.hiddenTickets.length = 0 
			this.state.showRestore = false;
		}
	}

	handleCheck= (id:string)=> { 
		return this.state.PinnedTickets.some(ticket=>ticket.id === id);
	}

	pinTickets = (id:string) =>{  //store pinned tickets in PinnedTickets array
		if (this.state.tickets) {
			if(!this.handleCheck(id)){
			alert("pinned")	
			this.setState( {			
				PinnedTickets: [...this.state.PinnedTickets, this.state.tickets.find(ticket => ticket.id === id)] 			
			})	
		 }	
		 
		else{
			alert("unpinned")
			this.setState( {			
				PinnedTickets: [...this.state.PinnedTickets.filter(ticket => ticket.id !== id)] 			
			})

		}
		}	

	}

	DisplayPined = () =>{     //display only the PinnedTickets array
		if (this.state.PinnedTickets.length>0)
		{
			if (this.state.tickets) {
				this.setState({
					tickets: [...this.state.PinnedTickets],
					PinnedTickets: []
				})
				this.state.showRestore=false;
			}
		}
	}

	returnFromPined = () =>{
		this.componentDidMount()
	}
	
	renderTickets = (tickets: Ticket[]) => {


		const filteredTickets = tickets;
	
		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket' >
				<button onClick={()=>this.hideTicketOnClick(ticket.id)} className='HideBotton' >  Hide </button>    {/*create Hide button */}   	
				<button id="pinned" onClick={()=>this.pinTickets(ticket.id)}  className='pinButton'  >  Pin/Unpin </button>    {/*create Pin button */} 
			
				<h5 className='title'>{ticket.title}</h5>
		    	<h6 className='content'>{ticket.content}</h6>  {/*Display the content (task 1.a) */}
				<footer>
					<div className='meta-data'> By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					<div className='lables'>  { ticket.labels? ticket.labels.map((labels) =>   
					(<span key ={ labels} className='label'>{labels}</span>) )  :null }</div>      {/*Display the lables (task 1.c) */}
				</footer>				
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);
		
		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
			this.componentDidMount()
		}, 300);	
	}

	render() {	
		const {tickets} = this.state;


		return (<main>
			<h1>Tickets List</h1>

			<header>		
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>

			{tickets ? <div className='results'>Showing {tickets.length} results <a></a>  
				{this.state.showRestore &&(<span id="showRestore" >({this.state.hiddenTickets.length}  hidden tickets)
				<button className='btn' onClick={this.restoreTicketsOnClick}>restore</button></span>)}</div> : null }

			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}

				<button className='PrevButton' onClick={this.prevPage}>Prev</button> <a> </a>
				<button className='NextButton' onClick={this.nextPage}>Next</button>
				<button  onClick={this.DisplayPined}>Display Pinned</button><a> </a>
				<button  onClick={this.returnFromPined}>Return</button>				
		</main>)
	}
}

export default App;