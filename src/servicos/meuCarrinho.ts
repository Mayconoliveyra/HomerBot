import { IProdutoMC } from '../banco/models/produtoMC';

import { Repositorios } from '../repositorios';

import { Axios } from '../servicos/axios';
import {
  IAutenticar,
  IGetEmpresa,
  IGetUsuario,
  IMCAutenticar,
  IMCErroValidacao,
  IMCGetCategorias,
  IMCGetEmpresa,
  IMCGetUsuario,
  IMCGetProdutoVariacao,
  IMCGetProdutos,
  IMCAddImgPorUrl,
  IMCCriarCategoria,
  IMCCriarProduto,
  IMCCriarVariacaoItem,
  IMCCriarVariacaoCabecalho,
  IMCCriarVariacaoCabecalhoResponse,
  IMCCriarVariacaoItemResponse,
  IMCGetProdutoVariacaoResponse,
} from '../servicos/types/meuCarrinho';

import { Util } from '../util';
import { IRetorno } from '../util/tipagens';

import { Servicos } from '.';

const BASE_URL_MC = 'https://api.meucarrinho.delivery';

const MODULO = '[Meu Carrinho]';

const formatarErroValidacao = (erro: any): string => {
  try {
    const responseData = erro?.response?.data as IMCErroValidacao;

    // Se for estrutura conhecida de validação
    if (responseData?.errors && typeof responseData.errors === 'object') {
      return Object.entries(responseData.errors)
        .map(([campo, mensagens]) => `${campo.toUpperCase()}: ${(mensagens as string[]).join(', ')}`)
        .join('; ');
    }

    // Se tiver título de erro HTTP padrão
    if (responseData?.title) return responseData.title;

    // Fallback
    return 'Erro desconhecido ao processar a requisição.';
  } catch (err) {
    return 'Erro inesperado ao tratar erro.';
  }
};

const autenticar = async (usuario: string, senha: string): Promise<IRetorno<IAutenticar>> => {
  try {
    const response = await Axios.defaultAxios.post<IMCAutenticar>(`${BASE_URL_MC}/auth/token`, {
      username: usuario,
      password: senha,
    });

    // O token do meu carrinho expira em 4horas = "expiresIn: 14400" = 14400s
    // Logo, na minha aplicação era vai expirar em 3horas, isso evita erros na hora de fazer requisição.
    const newExpToken = Math.floor(Date.now() / 1000) + 3 * 60 * 60;

    return {
      sucesso: true,
      dados: { token: response.data.token, expiresAt: newExpToken },
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao autenticar usuário`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getUsuario = async (token: string): Promise<IRetorno<IGetUsuario>> => {
  try {
    const response = await Axios.defaultAxios.get<IMCGetUsuario>(`${BASE_URL_MC}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      sucesso: true,
      dados: { merchantId: response.data.id },
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados do usuário`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getEmpresa = async (token: string, merchantId: string): Promise<IRetorno<IGetEmpresa>> => {
  try {
    const response = await Axios.defaultAxios.get<IMCGetEmpresa>(`${BASE_URL_MC}/merchants/${merchantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      sucesso: true,
      dados: { nome: response.data.name || '', cnpj: response.data.cnpj || '' },
      erro: null,
      total: 1,
    };
  } catch (error: any) {
    Util.Log.error(`${MODULO} | Erro ao consultar dados da empresa`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getCategorias = async (empresaId: number, merchantId: string): Promise<IRetorno<IMCGetCategorias[]>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.get<IMCGetCategorias[]>(`/categories?merchantId=${merchantId}`);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: response.data?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar categorias.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getProdutos = async (empresaId: number): Promise<IRetorno<IMCGetProdutos[]>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }
    const result: IMCGetProdutos[] = [];

    const pageSize = 500;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await apiAxiosMC.get<IMCGetProdutos[]>(`/products?pageNumber=${page}&pageSize=${pageSize}`);
      const produtos = response.data;

      if (produtos.length > 0) {
        result.push(...produtos);
        page += 1;
      } else {
        hasMore = false;
      }
    }

    return {
      sucesso: true,
      dados: result,
      erro: null,
      total: result?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar produtos.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const getProdutoVariacao = async (empresaId: number, produtoId: string): Promise<IRetorno<IMCGetProdutoVariacaoResponse[] | []>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.get<IMCGetProdutoVariacao>(`/products/${produtoId}`);

    return {
      sucesso: true,
      dados: response.data.variations,
      erro: null,
      total: response.data?.variations?.length || 0,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao consultar produto por id.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const addImgPorUrl = async (empresaId: number, produtoId: string, url: string): Promise<IRetorno<IMCAddImgPorUrl>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const body = {
      url: url,
      jpegQuality: 100,
    };

    const response = await apiAxiosMC.post<IMCAddImgPorUrl>(`/products/${produtoId}/images/url`, body);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao adicionar imagem pela url.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const deleteCategoriaPorId = async (empresaId: number, categoriaId: string): Promise<IRetorno<{ id: string }>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.delete(`/categories/${categoriaId}`).catch((error) => {
      if (error.response && error.response.status === 404) {
        // Categoria não encontrada
        Util.Log.warn(`Categoria ${categoriaId} não existente no Meu Carrinho.`);
      } else {
        throw error; // Relança o erro para ser tratado no nível superior, se necessário
      }
    });

    return {
      sucesso: true,
      dados: { id: categoriaId },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao remover categoria.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeCategoria = async (
  empresaId: number,
  categoriaId: string,
  novaDisponibilidade: 'AVAILABLE' | 'UNAVAILABLE',
): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/categories/${categoriaId}/availability/${novaDisponibilidade}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar a disponibilidade da categoria.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeProduto = async (empresaId: number, produtoId: string, novaDisponibilidade: 'AVAILABLE' | 'UNAVAILABLE'): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/products/${produtoId}/availability/${novaDisponibilidade}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar a disponibilidade do produto.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeVariacaoItem = async (
  empresaId: number,
  variacaoId: string,
  variacaoItemId: string,
  novaDisponibilidade: 'AVAILABLE' | 'UNAVAILABLE',
): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/variations/${variacaoId}/items/${variacaoItemId}/availability/${novaDisponibilidade}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar a disponibilidade da variação item.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarCategoria = async (empresaId: number, novaCategoria: IMCCriarCategoria): Promise<IRetorno<IMCGetCategorias>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCGetCategorias>(`/categories`, novaCategoria);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar categoria.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarProduto = async (empresaId: number, novoProduto: IMCCriarProduto): Promise<IRetorno<IMCGetProdutos>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCGetProdutos>(`/products`, novoProduto);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar produto.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarVariacaoCabecalho = async (
  empresaId: number,
  produtoId: string,
  novaVariacaoCabecalho: IMCCriarVariacaoCabecalho,
): Promise<IRetorno<IMCCriarVariacaoCabecalhoResponse>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCCriarVariacaoCabecalhoResponse>(`/products/${produtoId}/variations`, novaVariacaoCabecalho);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar o cabeçalho da variação.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const criarVariacaoItem = async (
  empresaId: number,
  variacaoId: string,
  novaVariacaoItem: IMCCriarVariacaoItem,
): Promise<IRetorno<IMCCriarVariacaoItemResponse>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const response = await apiAxiosMC.post<IMCCriarVariacaoItemResponse>(`/variations/${variacaoId}/items`, novaVariacaoItem);

    return {
      sucesso: true,
      dados: response.data,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao cadastrar o item da variação.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const deleteProdutoPorId = async (empresaId: number, produtoId: string): Promise<IRetorno<{ id: string }>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.delete(`/products/${produtoId}`).catch((error) => {
      if (error.response && error.response.status === 404) {
        // Categoria não encontrada
        Util.Log.warn(`Produto ${produtoId} não existente no Meu Carrinho.`);
      } else {
        throw error; // Relança o erro para ser tratado no nível superior, se necessário
      }
    });

    return {
      sucesso: true,
      dados: { id: produtoId },
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao remover produto por id.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atOrdenarVariacaoCabecalho = async (empresaId: number, produtoId: string, variacaoId: string, priority: number): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const body = [{ id: variacaoId, priority: priority }];

    await apiAxiosMC.patch(`/products/${produtoId}/variations/reorder`, body);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar ordenação do cabeçalho da variação.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atControleEstoque = async (empresaId: number, produtoId: string, active: boolean): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    await apiAxiosMC.patch(`/products/${produtoId}/stock/${active}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar controle de estoque.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidade = async (empresaId: number, produtos: { id: string; availability: 'AVAILABLE' | 'UNAVAILABLE' }[]): Promise<IRetorno<string>> => {
  function dividirEmLotes<T>(array: T[], size: number): T[][] {
    const resultado = [];
    for (let i = 0; i < array.length; i += size) {
      resultado.push(array.slice(i, i + size));
    }
    return resultado;
  }

  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const lotes = dividirEmLotes(produtos, 15); // Dividindo em lotes de 15

    for (const lote of lotes) {
      // Usando Promise.all para processar o lote em paralelo
      await Promise.all(
        lote.map(async ({ id, availability }) => {
          try {
            await apiAxiosMC.patch(`/products/${id}/availability/${availability}`);
          } catch (error) {
            Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade para ID ${id}`, error);
          }
        }),
      );
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atDisponibilidadeVariacao = async (
  empresaId: number,
  variacoes: { variationId: string; id: string; availability: 'AVAILABLE' | 'UNAVAILABLE' }[],
): Promise<IRetorno<string>> => {
  function dividirEmLotes<T>(array: T[], size: number): T[][] {
    const resultado = [];
    for (let i = 0; i < array.length; i += size) {
      resultado.push(array.slice(i, i + size));
    }
    return resultado;
  }

  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const lotes = dividirEmLotes(variacoes, 15); // Dividindo em lotes de 15

    for (const lote of lotes) {
      // Usando Promise.all para processar o lote em paralelo
      await Promise.all(
        lote.map(async ({ variationId, id, availability }) => {
          try {
            await apiAxiosMC.patch(`/variations/${variationId}/items/${id}/availability/${availability}`);
          } catch (error) {
            Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade da variação ID ${id}`, error);
          }
        }),
      );
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar disponibilidade das variações em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atEstoque = async (empresaId: number, produtos: { id: string; stock: number }[]): Promise<IRetorno<string>> => {
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const pageSize = 100; // Tamanho do lote
    let startIndex = 0; // Índice inicial
    let endIndex = pageSize; // Índice final

    while (startIndex < produtos.length) {
      // Dividindo os dados em lotes de 100
      const batch = produtos.slice(startIndex, endIndex);

      // Enviando o lote para a API
      await apiAxiosMC.patch(`/products/stock`, batch);

      // Atualizando os índices para o próximo lote
      startIndex = endIndex;
      endIndex += pageSize;
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar estoque em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const atEstoqueVariacao = async (empresaId: number, variacoes: { variationId: string; id: string; stock: number }[]): Promise<IRetorno<string>> => {
  function agruparPorVariationId(data: { variationId: string; id: string; stock: number }[], limit: number) {
    const grupos: Record<string, { variationId: string; id: string; stock: number }[]> = {};

    // Agrupar por variationId
    data.forEach((item) => {
      if (!grupos[item.variationId]) {
        grupos[item.variationId] = [];
      }
      grupos[item.variationId].push(item);
    });

    // Dividir em lotes de no máximo `limit`
    const lotes: { variationId: string; id: string; stock: number }[][] = [];
    Object.values(grupos).forEach((group) => {
      for (let i = 0; i < group.length; i += limit) {
        lotes.push(group.slice(i, i + limit));
      }
    });

    return lotes;
  }
  try {
    const apiAxiosMC = await Axios.axiosMeuCarrinho(empresaId);
    if (typeof apiAxiosMC === 'string') {
      return {
        sucesso: false,
        dados: null,
        erro: apiAxiosMC,
        total: 1,
      };
    }

    const pageSize = 50; // Limite de 50 produtos por lote
    const lotes = agruparPorVariationId(variacoes, pageSize); // Agrupa e divide em lotes

    for (const batch of lotes) {
      const variationId = batch[0].variationId; // Código da variação

      // Enviando o lote para a API
      await apiAxiosMC.patch(`/variations/${variationId}/items/stock`, batch);
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao atualizar estoque das variações em lote.`, error);
    const erroTratado = formatarErroValidacao(error);

    return {
      sucesso: false,
      dados: null,
      erro: erroTratado,
      total: 1,
    };
  }
};

const zerarCadastros = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  try {
    const allCategoriasMc = await getCategorias(empresaId, merchantId);
    if (!allCategoriasMc.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allCategoriasMc.erro,
        total: 1,
      };
    }

    for (const categoria of allCategoriasMc.dados) {
      const resDeleteCategoriaPorId = await deleteCategoriaPorId(empresaId, categoria.id);

      if (!resDeleteCategoriaPorId.sucesso) {
        return {
          sucesso: false,
          dados: null,
          erro: resDeleteCategoriaPorId.erro,
          total: 1,
        };
      }
    }

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao zerar cadastros.`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const alimentarProdutos = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  try {
    let totalVariacoesEncontradas = 0;
    let totalVariacoesItensEncontrados = 0;

    const resultApagarProdutos = await Repositorios.ProdutosMC.apagarProdutosPorEmpresaId(empresaId);
    if (!resultApagarProdutos) {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 1,
      };
    }

    // ### CATEGORIAS ####
    const allCategorias = await getCategorias(empresaId, merchantId);
    if (!allCategorias.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allCategorias.erro,
        total: 1,
      };
    }
    Util.Log.info(`${MODULO} | Total de categorias encontradas: ${allCategorias.dados.length}`);

    // ### PRODUTOS ####
    const allProdutosMc = await getProdutos(empresaId);
    if (!allProdutosMc.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: allProdutosMc.erro,
        total: 1,
      };
    }
    Util.Log.info(`${MODULO} | Total de produtos encontrados: ${allProdutosMc.dados.length}`);

    // Inserir categorias em massa
    if (allCategorias.dados.length) {
      const categoriasPromises: Partial<IProdutoMC>[] = allCategorias.dados
        .filter((c) => {
          if (!c.code) {
            Util.Log.warn(`${MODULO} | Categoria ignorada. Sem codigo PDV.`, c);
            return false;
          }

          return true;
        })
        .map((c) => ({
          type: 'CATEGORY',
          empresa_id: empresaId,
          c_id: c.id,
          c_code: c.code,
          c_name: c.name,
          c_availability: c.availability,
        }));

      const resultInserirCategorias = await Repositorios.ProdutosMC.inserir(categoriasPromises);
      if (!resultInserirCategorias) {
        return {
          sucesso: false,
          dados: null,
          erro: Util.Msg.erroInesperado,
          total: 1,
        };
      }
    }

    // Carregar mapa de categorias
    const dbCategorias = await Repositorios.ProdutosMC.consultarCategorias(empresaId);
    if (!dbCategorias) {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 1,
      };
    }
    const categoriasMap = new Map(dbCategorias.map((c) => [c.c_id, c]));

    // Processar produtos
    if (allProdutosMc.dados.length > 0) {
      for (const p of allProdutosMc.dados) {
        const c = categoriasMap.get(p.categoryId);

        if (!p.code || !c) {
          //  Util.Log.warn(`${MODULO} | Produto ignorado. Sem codigo PDV no produto ou na categoria.`, p);
          continue;
        }

        const modeloProduct: Partial<IProdutoMC> = {
          type: 'PRODUCT',
          empresa_id: empresaId,
          c_id: c.c_id,
          c_code: c.c_code,
          c_name: c.c_name,
          c_availability: c.c_availability,
          p_id: p.id,
          p_name: p.name,
          p_description: p.description || null,
          p_category_id: p.categoryId,
          p_price: p.price || 0,
          p_code: p.code,
          p_availability: p.availability,
          p_stock_current: p.stock.current,
          p_stock_active: p.stock.active,
          p_variations_grid: p.variationsGrid,
        };

        const resultInserirProduto = await Repositorios.ProdutosMC.inserir(modeloProduct);
        if (!resultInserirProduto) {
          return {
            sucesso: false,
            dados: null,
            erro: Util.Msg.erroInesperado,
            total: 1,
          };
        }

        // ### VARIAÇÕES CABEÇALHO ####
        const productAndVariation = await getProdutoVariacao(empresaId, p.id);
        // Se houver erro retornar
        if (!productAndVariation.sucesso) {
          return {
            sucesso: false,
            dados: null,
            erro: productAndVariation.erro,
            total: 1,
          };
        }

        // Verifica se o produto tem variações
        if (productAndVariation.dados && productAndVariation.dados.length > 0) {
          for (const v of productAndVariation.dados) {
            totalVariacoesEncontradas++;

            const modeloVariation: Partial<IProdutoMC> = {
              type: 'VARIATION_HEADER',
              empresa_id: empresaId,
              v_id: v.id,
              v_name: v.name,
              v_required: v.required,
              v_items_min: v.itemsMin,
              v_items_max: v.itemsMax,
              v_availability: v.availability,
              v_name_hash: Util.Texto.gerarHashTexto(Util.Texto.formatarParaTextoSimples(`${modeloProduct.p_code}${v.name}`)),
            };

            // ### VARIAÇÕES ITENS ####
            const resultInserirVariacao = await Repositorios.ProdutosMC.inserir({ ...modeloProduct, ...modeloVariation });
            if (!resultInserirVariacao) {
              return {
                sucesso: false,
                dados: null,
                erro: Util.Msg.erroInesperado,
                total: 1,
              };
            }

            // Verifica se tem itens na variação.
            if (v.items && v.items.length > 0) {
              const itensVariacao: Partial<IProdutoMC>[] = v.items.map((vi) => {
                totalVariacoesItensEncontrados++;

                return {
                  ...modeloProduct,
                  ...modeloVariation,
                  type: 'VARIATION_ITEM',
                  empresa_id: empresaId,
                  vi_id: vi.id,
                  vi_code: vi.code,
                  vi_name: vi.name,
                  vi_description: vi.description || null,
                  vi_value: vi.value,
                  vi_availability: vi.availability,
                  vi_stock_current: vi.stock.current,
                  vi_stock_active: vi.stock.active,
                };
              });

              const resultInserirVariacaoItens = await Repositorios.ProdutosMC.inserir(itensVariacao);
              if (!resultInserirVariacaoItens) {
                return {
                  sucesso: false,
                  dados: null,
                  erro: Util.Msg.erroInesperado,
                  total: 1,
                };
              }
            }
          }
        }
      }
    }

    Util.Log.info(`${MODULO} | Total de variações encontradas: ${totalVariacoesEncontradas}`);
    Util.Log.info(`${MODULO} | Total de variações item encontrados: ${totalVariacoesItensEncontrados}`);

    return {
      sucesso: true,
      dados: Util.Msg.sucesso,
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error(`${MODULO} | Erro ao alimentar os produtos do Meu Carrinho`, error);

    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

const exportarMercadoriasParaMeuCarrinho = async (empresaId: number, merchantId: string): Promise<IRetorno<string>> => {
  try {
    // 1.1 Alimentar com os produtos do Meu Carrinho
    const resProdsMc = await alimentarProdutos(empresaId, merchantId);
    if (!resProdsMc.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resProdsMc.erro,
        total: 1,
      };
    }

    // 1.2 Alimentar com os produtos ERP
    const resProdsERP = await Servicos.alimentarProdutos(empresaId);
    if (!resProdsERP.sucesso) {
      return {
        sucesso: false,
        dados: null,
        erro: resProdsERP.erro,
        total: 1,
      };
    }

    // 2. Buscar dados processados do ERP
    const [categoriasERP, produtosERP, variacoesCabecalhoERP, variacoesItensERP] = await Promise.all([
      Repositorios.ProdutosERP.consultar(empresaId, 'CATEGORY', { coluna: 'erp_c_name', direcao: 'asc' }),
      Repositorios.ProdutosERP.consultar(empresaId, 'PRODUCT', { coluna: 'erp_c_name', direcao: 'asc' }),
      Repositorios.ProdutosERP.consultar(empresaId, 'VARIATION_HEADER', { coluna: 'erp_v_ordem', direcao: 'asc' }),
      Repositorios.ProdutosERP.consultar(empresaId, 'VARIATION_ITEM', { coluna: 'erp_vi_name', direcao: 'asc' }),
    ]);
    if (!categoriasERP || !produtosERP || !variacoesCabecalhoERP || !variacoesItensERP) {
      return {
        sucesso: false,
        dados: null,
        erro: Util.Msg.erroInesperado,
        total: 1,
      };
    }

    // 3. Cadastrar categorias no MC
    Util.Log.info('Iniciando cadastro de categorias...');
    for (const c of categoriasERP) {
      const prodVinculadoCat = await Repositorios.ProdutosERP.consultarPrimeiroRegistroPorColuna(empresaId, 'PRODUCT', 'erp_c_code', c.erp_c_code || '');
      if (!prodVinculadoCat) {
        // Util.Log.info(`Categoria ignorada, não tem nenhum produto vinculado: Id:${c.erp_c_code} | Nome:${c.erp_c_name}`);
        continue;
      }

      const categoriaJaExistMC = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(empresaId, 'CATEGORY', 'c_code', c.erp_c_code || '');

      // So vai cadastrar se ainda não existir no meu carrinho e se tiver algum produto vinculado a categoria
      if (!categoriaJaExistMC && prodVinculadoCat) {
        const modeloCategoria: IMCCriarCategoria = {
          merchantId: merchantId,
          code: Util.Texto.truncarTexto(c.erp_c_code, 100) || '',
          name: Util.Texto.truncarTexto(c.erp_c_name, 100) || '',
        };

        if (Util.Outros.ehObjetoValido<IMCCriarCategoria>(modeloCategoria, [])) {
          const resCriarCategoria = await Servicos.MeuCarrinho.criarCategoria(empresaId, modeloCategoria);

          if (!resCriarCategoria.sucesso || !resCriarCategoria.dados) {
            return {
              sucesso: false,
              dados: null,
              erro: resCriarCategoria.erro,
              total: 1,
            };
          }

          const resAtDisponibilidadeCategoria = await Servicos.MeuCarrinho.atDisponibilidadeCategoria(empresaId, resCriarCategoria.dados.id, 'AVAILABLE');
          if (!resAtDisponibilidadeCategoria.sucesso) {
            return {
              sucesso: false,
              dados: null,
              erro: resAtDisponibilidadeCategoria.erro,
              total: 1,
            };
          }

          const resModeloCategoria: Partial<IProdutoMC> = {
            type: 'CATEGORY',
            empresa_id: empresaId,
            c_id: resCriarCategoria.dados.id,
            c_code: resCriarCategoria.dados.code,
            c_name: resCriarCategoria.dados.name,
            c_availability: 'AVAILABLE',
          };

          const resultInserirCategoriaDb = await Repositorios.ProdutosMC.inserir(resModeloCategoria);
          if (!resultInserirCategoriaDb) {
            return {
              sucesso: false,
              dados: null,
              erro: Util.Msg.erroInesperado,
              total: 1,
            };
          }
        } else {
          return {
            sucesso: false,
            dados: null,
            erro: `Categoria não cadastrada por falta de informação: ${JSON.stringify(modeloCategoria)}`,
            total: 1,
          };
        }
      }
    }

    // 4. Cadastrar produtos
    Util.Log.info('Iniciando cadastro de produtos...');
    for (const p of produtosERP) {
      const categoriaId = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(empresaId, 'CATEGORY', 'c_code', p.erp_c_code || '');
      const produtoJaExistMC = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(empresaId, 'PRODUCT', 'p_code', p.erp_p_code || '');

      /*   if (Util.Outros.ehObjetoValido<IMCCriarCategoria>(modeloCategoria, [])) {
        const resCriarCategoria = await Servicos.MeuCarrinho.criarCategoria(empresaId, modeloCategoria);
 */
      // Se já existe não vou fazer nada
      if (!produtoJaExistMC) {
        if (!categoriaId || !categoriaId.c_id) {
          return {
            sucesso: false,
            dados: null,
            erro: `Categoria não encontrada no banco(categoriaId): ${p.erp_p_name}`,
            total: 1,
          };
        }

        const modeloProduto: IMCCriarProduto = {
          merchantId: merchantId,
          categoryId: categoriaId?.c_id || '',
          name: Util.Texto.truncarTexto(p.erp_p_name, 100) || '',
          code: Util.Texto.truncarTexto(p.erp_p_code, 100) || '',
          description: Util.Texto.truncarTexto(p.erp_p_description, 500) || '',
          price: p.erp_p_price || 0,
        };

        const imagesUrl = JSON.parse(p.erp_p_images || '[]') as string[];

        if (Util.Outros.ehObjetoValido<IMCCriarProduto>(modeloProduto, ['description'])) {
          const resCriarProduto = await Servicos.MeuCarrinho.criarProduto(empresaId, modeloProduto);
          if (!resCriarProduto.sucesso || !resCriarProduto.dados) {
            return {
              sucesso: false,
              dados: null,
              erro: resCriarProduto.erro,
              total: 1,
            };
          }

          const resAtDisponibilidadeProduto = await Servicos.MeuCarrinho.atDisponibilidadeProduto(empresaId, resCriarProduto.dados.id, 'AVAILABLE');
          if (!resAtDisponibilidadeProduto.sucesso) {
            return {
              sucesso: false,
              dados: null,
              erro: resAtDisponibilidadeProduto.erro,
              total: 1,
            };
          }

          // Adicionar as imagens
          if (imagesUrl && imagesUrl.length > 0) {
            for (const img of imagesUrl) {
              const resAddImgPorUrl = await Servicos.MeuCarrinho.addImgPorUrl(empresaId, resCriarProduto.dados.id, img);
              if (!resAddImgPorUrl.sucesso || !resAddImgPorUrl.dados) {
                return {
                  sucesso: false,
                  dados: null,
                  erro: resAddImgPorUrl.erro,
                  total: 1,
                };
              }
            }
          }

          const resModeloProduct: Partial<IProdutoMC> = {
            type: 'PRODUCT',
            empresa_id: empresaId,
            c_id: categoriaId?.c_id || '',
            c_code: categoriaId?.c_code || '',
            c_name: categoriaId?.c_name || '',
            c_availability: categoriaId.c_availability || 'AVAILABLE',
            p_id: resCriarProduto.dados.id,
            p_name: Util.Texto.truncarTexto(p.erp_p_name, 100) || '',
            p_description: Util.Texto.truncarTexto(p.erp_p_description, 500) || '',
            p_category_id: categoriaId.c_id,
            p_price: p.erp_p_price || 0,
            p_code: p.erp_p_code || '',
            p_availability: p.erp_p_availability || 'AVAILABLE',
            p_stock_current: p.erp_p_stock_current || 0,
            p_stock_active: p.erp_p_stock_active || false,
            p_variations_grid: p.erp_p_variations_grid || false,
          };

          const resultInserirProdutoDb = await Repositorios.ProdutosMC.inserir(resModeloProduct);
          if (!resultInserirProdutoDb) {
            return {
              sucesso: false,
              dados: null,
              erro: Util.Msg.erroInesperado,
              total: 1,
            };
          }
        } else {
          return {
            sucesso: false,
            dados: null,
            erro: `Produto não cadastrada por falta de informação: ${JSON.stringify(modeloProduto)}`,
            total: 1,
          };
        }
      }
    }

    // 5. Cadastrar cabeçalho das variações
    for (const v of variacoesCabecalhoERP) {
      const produto = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(empresaId, 'PRODUCT', 'p_code', v.erp_p_code || '');

      const variacaoCabeçalhoJaExiste = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(
        empresaId,
        'VARIATION_HEADER',
        'v_name_hash',
        v.erp_v_name_hash || '',
      );

      // Se não existir vou cadastrar
      if (!variacaoCabeçalhoJaExiste) {
        if (!produto || !produto.p_id) {
          return {
            sucesso: false,
            dados: null,
            erro: `Produto principal não foi encontrado no banco: ${Util.Texto.truncarTexto(v.erp_v_name, 100) || ''}`,
            total: 1,
          };
        }

        const modeloVariacaoCabecalho: IMCCriarVariacaoCabecalho = {
          name: Util.Texto.truncarTexto(v.erp_v_name, 100) || '',
          required: v.erp_v_required ?? false,
          itemsMin: v.erp_v_items_min ?? 1,
          itemsMax: v.erp_v_items_max ?? 1,
        };

        if (Util.Outros.ehObjetoValido<IMCCriarVariacaoCabecalho>(modeloVariacaoCabecalho, [])) {
          const resCriarVariacaoCabecalho = await Servicos.MeuCarrinho.criarVariacaoCabecalho(empresaId, produto.p_id, modeloVariacaoCabecalho);
          if (!resCriarVariacaoCabecalho.sucesso || !resCriarVariacaoCabecalho.dados) {
            return {
              sucesso: false,
              dados: null,
              erro: resCriarVariacaoCabecalho.erro,
              total: 1,
            };
          }

          const resAtOrdenarVariacaoCabecalho = await Servicos.MeuCarrinho.atOrdenarVariacaoCabecalho(
            empresaId,
            produto.p_id,
            resCriarVariacaoCabecalho.dados.id,
            v.erp_v_ordem ?? 0,
          );
          if (!resAtOrdenarVariacaoCabecalho.sucesso) {
            return {
              sucesso: false,
              dados: null,
              erro: resAtOrdenarVariacaoCabecalho.erro,
              total: 1,
            };
          }

          const modeloVariation: Partial<IProdutoMC> = {
            type: 'VARIATION_HEADER',
            empresa_id: empresaId,
            c_id: produto.c_id,
            c_code: produto.c_code,
            c_name: produto.c_name,
            c_availability: produto.c_availability,
            p_id: produto.p_id,
            p_name: produto.p_name,
            p_description: produto.p_description,
            p_category_id: produto.p_category_id,
            p_price: produto.p_price,
            p_code: produto.p_code,
            p_availability: produto.p_availability,
            p_stock_current: produto.p_stock_current,
            p_stock_active: produto.p_stock_active,
            p_variations_grid: produto.p_variations_grid,

            v_id: resCriarVariacaoCabecalho.dados.id,
            v_name: v.erp_v_name,
            v_required: v.erp_v_required ?? false,
            v_items_min: v.erp_v_items_min ?? 1,
            v_items_max: v.erp_v_items_max ?? 1,
            v_availability: v.erp_v_availability ?? 'AVAILABLE',
            v_name_hash: Util.Texto.gerarHashTexto(Util.Texto.formatarParaTextoSimples(`${produto.p_code}${v.erp_v_name}`)),
          };

          const resultInserirVariacoes = await Repositorios.ProdutosMC.inserir(modeloVariation);
          if (!resultInserirVariacoes) {
            return {
              sucesso: false,
              dados: null,
              erro: Util.Msg.erroInesperado,
              total: 1,
            };
          }
        } else {
          return {
            sucesso: false,
            dados: null,
            erro: `Cabeçalho da variação não cadastrada por falta de informação: ${JSON.stringify(modeloVariacaoCabecalho)}`,
            total: 1,
          };
        }
      }
    }

    // Aguarda 30 segundos antes de iniciar o próximo loop
    // Necessário para garantir que todas variações cabeçalho já tenham sido inseridas.
    await Util.Outros.delay(30000);

    // 5. Cadastrar cabeçalho das variações
    Util.Log.info('Iniciando cadastro de cabeçalhos de variações...');
    for (const vi of variacoesItensERP) {
      const viJaExiste = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(empresaId, 'VARIATION_ITEM', 'vi_code', vi.erp_vi_code || '');

      // Se não existir vou cadastrar
      if (!viJaExiste) {
        const variacaoCabecalho = await Repositorios.ProdutosMC.consultarPrimeiroRegistroPorColuna(
          empresaId,
          'VARIATION_HEADER',
          'v_name_hash',
          vi.erp_v_name_hash || '',
        );

        if (!variacaoCabecalho || !variacaoCabecalho.v_id) {
          return {
            sucesso: false,
            dados: null,
            erro: `Variação cabeçalho não foi entrada no banco(variacaoCabecalhoId): ${vi.erp_v_name}`,
            total: 1,
          };
        }

        const modeloVariacaoItem: IMCCriarVariacaoItem = {
          name: Util.Texto.truncarTexto(vi.erp_vi_name, 100) || '',
          code: vi.erp_vi_code ?? '',
          description: Util.Texto.truncarTexto(vi.erp_vi_description, 500) || '',
          value: vi.erp_vi_value ?? 0,
        };

        if (Util.Outros.ehObjetoValido<IMCCriarVariacaoItem>(modeloVariacaoItem, ['description'])) {
          const resCriarVariacaoItem = await Servicos.MeuCarrinho.criarVariacaoItem(empresaId, variacaoCabecalho.v_id, modeloVariacaoItem);
          if (!resCriarVariacaoItem.sucesso || !resCriarVariacaoItem.dados) {
            return {
              sucesso: false,
              dados: null,
              erro: resCriarVariacaoItem.erro,
              total: 1,
            };
          }

          const resAtDisponibilidadeVariacaoItem = await Servicos.MeuCarrinho.atDisponibilidadeVariacaoItem(
            empresaId,
            variacaoCabecalho.v_id,
            resCriarVariacaoItem.dados.id,
            'AVAILABLE',
          );
          if (!resAtDisponibilidadeVariacaoItem.sucesso) {
            return {
              sucesso: false,
              dados: null,
              erro: resAtDisponibilidadeVariacaoItem.erro,
              total: 1,
            };
          }
        } else {
          return {
            sucesso: false,
            dados: null,
            erro: `Item da variação não cadastrada por falta de informação: ${JSON.stringify(modeloVariacaoItem)}`,
            total: 1,
          };
        }
      }
    }

    return {
      sucesso: true,
      dados: 'Exportação finalizada com sucesso.',
      erro: null,
      total: 1,
    };
  } catch (error) {
    Util.Log.error('[ERP → MC] Erro ao exportar mercadorias', error);
    return {
      sucesso: false,
      dados: null,
      erro: Util.Msg.erroInesperado,
      total: 1,
    };
  }
};

export const MeuCarrinho = {
  autenticar,
  getUsuario,
  getEmpresa,
  getCategorias,
  getProdutos,
  getProdutoVariacao,
  criarCategoria,
  criarProduto,
  criarVariacaoCabecalho,
  criarVariacaoItem,
  atOrdenarVariacaoCabecalho,
  atDisponibilidadeCategoria,
  atDisponibilidadeProduto,
  atDisponibilidadeVariacaoItem,
  atControleEstoque,
  atDisponibilidade,
  atDisponibilidadeVariacao,
  atEstoque,
  atEstoqueVariacao,
  deleteCategoriaPorId,
  deleteProdutoPorId,
  addImgPorUrl,
  alimentarProdutos,
  exportarMercadoriasParaMeuCarrinho,
  zerarCadastros,
};
