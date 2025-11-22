const express = require('express');
const router = express.Router();
const {
        createConsultation,
        getAllConsultations,
        updateConsultation,
        getConsultationById,
        addCallMessage,
        getCallMessages
} = require('../controllers/consultationsController');
const adminAuth = require('../middleware/adminAuth');
const bearerAuth = require('../middleware/bearerAuth');

router.post('/create', createConsultation);

router.get('/', bearerAuth, getAllConsultations);

router.get('/:id', bearerAuth, getConsultationById);

router.patch('/:id', bearerAuth, updateConsultation);

// Call message management routes
router.post('/:id/call-messages', bearerAuth, addCallMessage);
router.get('/:id/call-messages', bearerAuth, getCallMessages);

module.exports = router;
