import { LightningElement, wire, track} from 'lwc';
import getRecords from '@salesforce/apex/getAccounts.getRecords';


const columns = [
    {
        label: "Name", fieldName: "NameUrl", type: "url", sortable: "true", typeAttributes: {
            label: { fieldName: 'Name' }, target: '_blank'
        }
    },
    { label: "Email", fieldName: "CustomEmail__c", type: "Email", sortable: "true" }
];

const PAGE_SIZE = 50; 

export default class LargeDataVolumeComponent extends LightningElement {
    columns = columns
    @track accounts = [];
    @track pageNumber = 1;
    @track totalRecords = 0;
    @track totalPages = 0;
    @track isLoading = true;
    @track searchTerm = '';

    connectedCallback() {
        this.loadRecords();
    }

    loadRecords() {
        this.isLoading = true;
        getRecords({ pageSize: PAGE_SIZE, pageNumber: this.pageNumber, searchTerm: this.searchTerm })
            .then(result => {
                this.accounts = result.records.map(record => ({
                    ...record,
                    NameUrl: `/${record.Id}`
                }));
                this.totalRecords = result.totalRecords;
                this.totalPages = Math.ceil(this.totalRecords / PAGE_SIZE);
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error loading records', error);
                this.isLoading = false;
            });
    }

    handlePrevious() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadRecords();
        }
    }

    handleNext() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            this.loadRecords();
        }
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
        this.pageNumber = 1; 
        this.loadRecords();
    }

    get isPreviousDisabled() {
        return this.pageNumber <= 1;
    }

    get isNextDisabled() {
        return this.pageNumber >= this.totalPages;
    }
}