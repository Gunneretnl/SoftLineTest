USE [SoftLineDB]
GO
/****** Object:  Table [dbo].[ItensVenda]    Script Date: 27/02/2026 23:27:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ItensVenda](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VendaId] [int] NOT NULL,
	[ProdutoCodigo] [int] NOT NULL,
	[Quantidade] [int] NOT NULL,
	[ValorUnitario] [decimal](18, 2) NOT NULL,
	[Subtotal] [decimal](18, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ItensVenda]  WITH CHECK ADD  CONSTRAINT [FK_ItensVenda_Produto] FOREIGN KEY([ProdutoCodigo])
REFERENCES [dbo].[Produtos] ([Codigo])
GO
ALTER TABLE [dbo].[ItensVenda] CHECK CONSTRAINT [FK_ItensVenda_Produto]
GO
ALTER TABLE [dbo].[ItensVenda]  WITH CHECK ADD  CONSTRAINT [FK_ItensVenda_Venda] FOREIGN KEY([VendaId])
REFERENCES [dbo].[Vendas] ([Codigo])
GO
ALTER TABLE [dbo].[ItensVenda] CHECK CONSTRAINT [FK_ItensVenda_Venda]
GO
