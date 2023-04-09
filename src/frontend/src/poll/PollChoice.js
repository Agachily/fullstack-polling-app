import {Form, Input,} from 'antd';
import {DeleteOutlined} from "@ant-design/icons";

const FormItem = Form.Item;

const PollChoice = ({choice, choiceNumber, handleChoiceChange, removeChoice}) => {
    return (
        <FormItem validateStatus={choice.validateStatus}
                  help={choice.errorMsg} className="poll-form-row">
            <Input placeholder={"Choice" + (choiceNumber + 1)}
                   size="large" value={choice.text}
                   className={choiceNumber > 1 ? "optional-choice" : null}
                   onChange={(event) => handleChoiceChange(event, choiceNumber)}/>
            {choiceNumber > 1
                ? <DeleteOutlined disabled={choiceNumber <= 1} onClick={() => removeChoice(choiceNumber)}/>
                : null}
        </FormItem>
    )
}

export default PollChoice