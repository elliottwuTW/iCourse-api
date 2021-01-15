const express = require('express')
const router = express.Router()

// methods from controller
const { getGroups, getGroup, createGroup, updateGroup, deleteGroup } = require('../../controllers/groups')

const validator = require('../../middleware/validator')

router.get('/', getGroups)
router.get('/:id', getGroup)
router.post('/', validator.groupInfoExist, validator.groupInfo, createGroup)
router.put('/:id', validator.groupInfo, updateGroup)
router.delete('/:id', deleteGroup)

module.exports = router
