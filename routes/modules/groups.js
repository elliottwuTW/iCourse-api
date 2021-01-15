const express = require('express')
const router = express.Router()

// methods from controller
const { getGroups, getGroup, createGroup, updateGroup, deleteGroup } = require('../../controllers/groups')

router.get('/', getGroups)
router.get('/:id', getGroup)
router.post('/', createGroup)
router.put('/:id', updateGroup)
router.delete('/:id', deleteGroup)

module.exports = router
