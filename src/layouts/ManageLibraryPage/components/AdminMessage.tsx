import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const AdminMessage: React.FC<{message: MessageModel, submitResponseToQuestion: any}> = (props) => {
    const [displayWarning, setDisplayWarning] = useState(false);
    const [response, setResponse] = useState('');

    const submitBtn = () => {
        if(props.message !==null && response !== null){
            props.submitResponseToQuestion(props.message.id, response );
            setDisplayWarning(false);
        }else{
            setDisplayWarning(true);
        }
    }

    return (
        <div key={props.message.id}>
            <div className="card mt-3 p-3 rounded bg-body shadow">
                <h5>Case #{props.message.id}: {props.message.title}</h5>
                <h6>{props.message.userEmail}</h6>
                <p>{props.message.question}</p>
                <hr />
                <div>
                    <h5>Response:</h5>
                    <form method="PUT">
                        {displayWarning && (
                            <div className="alert-danger alert" role="alert" >
                                All fields must be filled out.
                            </div>
                        )}
                        <div className="col-md-12 mb-3">
                            <label className="form-label">Description</label>
                            <textarea name="" id="exampleFormControlTextarea1" rows={3} 
                            onChange={e => setResponse(e.target.value)} className="form-control" value={response}></textarea>
                        </div>
                        <button 
                        onClick={submitBtn} className="btn btn-primary mt-3" type="button">Submit Response</button>
                    </form>
                </div>
            </div>
        </div>
    );
}