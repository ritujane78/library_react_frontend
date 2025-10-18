class MessageModel{
    title: String;
    question: String;
    id?: number;
    userEmail ?: String;
    adminEmail ?: String
    response?: String
    closed ?: boolean

    constructor(title: String, question : String){
        this.title = title;
        this.question = question;
    }
}

export default MessageModel;