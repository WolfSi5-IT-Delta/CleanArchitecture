import { t } from 'i18next';
import React from 'react'
import { ActionButton, ButtonsRow, CancelButton } from './AdminPages/Page';
import Modal from './Modal';

export const ConfirmModal = ({ handleSave, showConfirmModal, setShowConfirmModal }) => {
  const doClose = () => {
    setShowConfirmModal(false);
  };
  return (
    <div>
      <Modal
        open={showConfirmModal}
        onClose={doClose}
      >
        <div>Вы хотите сохранить текущие изменения?</div>
        <ButtonsRow>
          <CancelButton className='sm:col-start-1' label={t('common:cancel')} onClick={doClose} />
          <ActionButton className='sm:col-start-3' label={t('common:save')} onClick={handleSave} />
        </ButtonsRow>
      </Modal>
    </div>
  )
}
