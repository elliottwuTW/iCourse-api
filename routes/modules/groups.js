const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { Group } = require('../../models')

// methods from controller
const { getGroups, getGroup, createGroup, updateGroup, deleteGroup } = require('../../controllers/groups')

const validator = require('../../middleware/validator')

router.get('/', getGroups)
router.get('/:id', validator.ifExist(Group), getGroup)
router.post('/', upload.single('photo'), validator.groupInfoExist, validator.groupInfo, createGroup)
router.put('/:id', validator.ifExist(Group), upload.single('photo'), validator.groupInfo, updateGroup)
router.delete('/:id', validator.ifExist(Group), deleteGroup)

module.exports = router
