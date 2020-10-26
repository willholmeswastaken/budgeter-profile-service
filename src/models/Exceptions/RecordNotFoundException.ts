class RecordNotFoundException extends Error {
    public searchIdentifier: string;

    constructor(searchIdentifier: string) {
        super('Couldn\'t find record!');
        this.name = 'RecordNotFoundException';
        this.searchIdentifier = searchIdentifier;
    }
}

export default RecordNotFoundException;