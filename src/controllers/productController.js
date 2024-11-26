import { productosModel } from "../dao/models/productsModel.js"; // Asegúrate de importar el modelo correcto

export const getProducts = async (req, res) => {
  const { limit = 10, page = 1, sort = '', query = '' } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
    lean: true
  };

  try {
    const filter = query ? { category: query } : {};
    const result = await productosModel.paginate(filter, options);
    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}` : null
    };
    res.render('index', response); 
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
