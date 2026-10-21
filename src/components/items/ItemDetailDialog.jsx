import { useState } from 'react'
import { MapPin, Calendar, Copy, Check, Lock, CheckCircle2 } from 'lucide-react'
import Dialog from '../ui/Dialog.jsx'
import ItemImage from '../ui/ItemImage.jsx'
import Badge from '../ui/Badge.jsx'
import Button from '../ui/Button.jsx'
import ClaimForm from './ClaimForm.jsx'
import { getLocation } from '../../constants/locations.js'
import { formatDate, timeAgo } from '../../utils/formatDate.js'
import './ItemDetailDialog.css'

export default function ItemDetailDialog({
  item,
  open = false,
  onClose,
  onClaimed,
}) {
  const [isClaiming, setIsClaiming] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!item) return null

  const location = getLocation(item.locationId)
  const isClaimed = item.status === 'claimed'

  const handleCopyContact = () => {
    if (!item.contact) return
    navigator.clipboard.writeText(item.contact)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClaimSubmit = async (claimPayload) => {
    await onClaimed(item.id, claimPayload)
    setIsClaiming(false)
  }

  const handleDialogClose = () => {
    setIsClaiming(false)
    onClose()
  }

  // Determine button title according to spec
  let actionButtonText = 'This is mine — claim it'
  if (item.status === 'lost') {
    actionButtonText = 'I found this item'
  } else if (isClaimed) {
    actionButtonText = 'Already claimed'
  }

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      title={isClaiming ? 'Submit Item Claim' : 'Item Details'}
      maxWidth="620px"
    >
      <div className="item-detail">
        {isClaiming ? (
          <ClaimForm
            item={item}
            onSubmit={handleClaimSubmit}
            onCancel={() => setIsClaiming(false)}
          />
        ) : (
          <>
            <div className="item-detail__media">
              <ItemImage
                src={item.image}
                alt={`Photo of ${item.title}`}
                category={item.category}
                className="item-detail__image"
              />
              <div className="item-detail__badge-slot">
                <Badge variant={item.status} />
              </div>
            </div>

            <div className="item-detail__header-info">
              <div className="item-detail__category">
                <Badge variant="category" categoryName={item.category} />
              </div>
              <h3 className="item-detail__title">{item.title}</h3>
            </div>

            <div className="item-detail__meta-grid">
              <div className="item-detail__meta-item">
                <MapPin size={16} className="item-detail__meta-icon" aria-hidden="true" />
                <div className="item-detail__meta-content">
                  <span className="item-detail__meta-label">Location</span>
                  <span className="item-detail__meta-value">{location.label}</span>
                </div>
              </div>

              <div className="item-detail__meta-item">
                <Calendar size={16} className="item-detail__meta-icon" aria-hidden="true" />
                <div className="item-detail__meta-content">
                  <span className="item-detail__meta-label">Reported Date</span>
                  <span className="item-detail__meta-value">
                    {formatDate(item.date)} ({timeAgo(item.date)})
                  </span>
                </div>
              </div>
            </div>

            <div className="item-detail__section">
              <h4 className="item-detail__section-title">Description</h4>
              <p className="item-detail__description">{item.description}</p>
            </div>

            {/* Poster Contact section - protected until claimed */}
            <div className="item-detail__section item-detail__contact-section">
              <h4 className="item-detail__section-title">Poster Contact Details</h4>
              {isClaimed ? (
                <div className="item-detail__revealed-contact">
                  <div className="item-detail__contact-info">
                    <span className="item-detail__contact-label">Direct Contact:</span>
                    <strong className="item-detail__contact-value">{item.contact}</strong>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={copied ? Check : Copy}
                    onClick={handleCopyContact}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              ) : (
                <div className="item-detail__hidden-contact">
                  <Lock size={16} className="item-detail__lock-icon" aria-hidden="true" />
                  <span>
                    Contact details are hidden to protect privacy until you submit a claim or recovery report below.
                  </span>
                </div>
              )}
            </div>

            {/* Claim details if item is already claimed */}
            {isClaimed && item.claim && (
              <div className="item-detail__claim-banner">
                <div className="item-detail__claim-header">
                  <CheckCircle2 size={16} color="var(--color-found-fg)" aria-hidden="true" />
                  <strong>Item Marked as Claimed</strong>
                </div>
                <p className="item-detail__claim-text">
                  Claimed by <strong>{item.claim.name}</strong> on{' '}
                  {formatDate(item.claim.claimedAt || item.date)}.
                </p>
                {item.claim.message && (
                  <p className="item-detail__claim-note">
                    Note: &ldquo;{item.claim.message}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="item-detail__actions">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleDialogClose}
              >
                Close
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setIsClaiming(true)}
                disabled={isClaimed}
              >
                {actionButtonText}
              </Button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  )
}
