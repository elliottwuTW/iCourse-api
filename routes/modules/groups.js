const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const { Group, Course } = require('../../models')

// request handlers
const { getGroups, getGroup, getGroupsInRadius, createGroup, updateGroup, deleteGroup } = require('../../controllers/groups')

// middleware
const { protect, permit } = require('../../middleware/auth')
const { ifExist, groupInfoExist, checkValidation, checkEmail, checkGroupName, checkGroupDescr, checkGroupWebsite, checkGroupPhone } = require('../../middleware/validator')
const query = require('../../middleware/query')

// routes
router.get('/', query(Group, [{ model: Course, attributes: ['id', 'name', 'description'] }]), getGroups)
router.get('/radius/:lat/:long/:radius', getGroupsInRadius)
router.get('/:id', ifExist(Group), getGroup)

router.post('/',
  protect,
  permit('publisher', 'admin'),
  upload.single('photo'),
  // validation
  groupInfoExist, checkEmail, checkGroupName, checkGroupDescr, checkGroupWebsite, checkGroupPhone, checkValidation,
  createGroup)

router.put('/:id',
  protect,
  permit('publisher', 'admin'),
  ifExist(Group),
  upload.single('photo'),
  // validation
  checkEmail, checkGroupName, checkGroupDescr, checkGroupWebsite, checkGroupPhone, checkValidation,
  updateGroup)

router.delete('/:id', protect, permit('publisher', 'admin'), ifExist(Group), deleteGroup)

module.exports = router
