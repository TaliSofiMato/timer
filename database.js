const postToDatabase = async (input) => {
    try {
        const response = await fetch ('https://abx50a09t3.execute-api.us-east-1.amazonaws.com/notes', {
            method: 'POST',
            body: JSON.stringify({text:input})
        });
        return await response.json()
    }catch(e){
        console.log(e)
    }
}    
const getNotesFromDatabase = async (data) => {
    const response = await fetch ('https://abx50a09t3.execute-api.us-east-1.amazonaws.com/notes')
    return await response.json();
}