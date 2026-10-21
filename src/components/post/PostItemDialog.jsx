import Dialog from '../ui/Dialog.jsx'
import PostItemForm from './PostItemForm.jsx'
import './PostItemDialog.css'

export default function PostItemDialog({ open, onClose, onCreated }) {
  const handleSubmit = async (itemPayload) => {
    await onCreated(itemPayload)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Report an Item"
      maxWidth="600px"
    >
      <PostItemForm onSubmit={handleSubmit} onCancel={onClose} />
    </Dialog>
  )
}
