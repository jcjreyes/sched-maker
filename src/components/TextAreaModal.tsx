import React, { useState } from 'react';
import '../stylesheets/modal.css';
interface TextAreaModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (inputText: string) => void;
}

const TextAreaModal: React.FC<TextAreaModalProps> = ({
	isOpen,
	onClose,
	onSave,
}) => {
	const [textareaValue, setTextareaValue] = useState('');

	const handleTextareaChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setTextareaValue(event.target.value);
	};

	const handleSave = () => {
		console.log('Textarea Value:', textareaValue);
		onSave(textareaValue);
		onClose();
	};

	return (
		<div style={{ display: isOpen ? 'block' : 'none' }}>
			<div className="modal">
				<div className="modal-content">
					<h2>Fill up Class Schedule</h2>
					<p>
						Go to your AISIS account and head to MY CLASS SCHEDULE. Copy the entire
						schedule table.
					</p>
					<textarea
						rows={10}
						cols={70}
						value={textareaValue}
						onChange={handleTextareaChange}
					/>
					<br />
					<button onClick={handleSave}>Save</button>
					<button onClick={onClose}>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default TextAreaModal;
