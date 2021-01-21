module.exports = (currentPage, limitPerPage, total) => {
  // page info
  const totalPages = Math.ceil(total / limitPerPage)

  return ({
    prev: (currentPage - 1) >= 1 ? (currentPage - 1) : null,
    next: (currentPage + 1) <= totalPages ? (currentPage + 1) : null,
    pages: totalPages
  })
}
