USE [SoftLineDB]
GO
/****** Object:  Table [dbo].[ItensVendas]    Script Date: 27/02/2026 23:27:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ItensVendas](
	[Codigo] [int] IDENTITY(1,1) NOT NULL,
	[VendaCodigo] [int] NOT NULL,
	[ProdutoCodigo] [int] NOT NULL,
	[Quantidade] [int] NOT NULL,
	[ValorUnitario] [decimal](18, 2) NOT NULL,
	[Subtotal] [decimal](18, 2) NOT NULL,
 CONSTRAINT [PK_ItensVendas] PRIMARY KEY CLUSTERED 
(
	[Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_ItensVendas_ProdutoCodigo]    Script Date: 27/02/2026 23:27:10 ******/
CREATE NONCLUSTERED INDEX [IX_ItensVendas_ProdutoCodigo] ON [dbo].[ItensVendas]
(
	[ProdutoCodigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
/****** Object:  Index [IX_ItensVendas_VendaCodigo]    Script Date: 27/02/2026 23:27:10 ******/
CREATE NONCLUSTERED INDEX [IX_ItensVendas_VendaCodigo] ON [dbo].[ItensVendas]
(
	[VendaCodigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ItensVendas]  WITH CHECK ADD  CONSTRAINT [FK_ItensVendas_Produtos_ProdutoCodigo] FOREIGN KEY([ProdutoCodigo])
REFERENCES [dbo].[Produtos] ([Codigo])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ItensVendas] CHECK CONSTRAINT [FK_ItensVendas_Produtos_ProdutoCodigo]
GO
ALTER TABLE [dbo].[ItensVendas]  WITH CHECK ADD  CONSTRAINT [FK_ItensVendas_Vendas_VendaCodigo] FOREIGN KEY([VendaCodigo])
REFERENCES [dbo].[Vendas] ([Codigo])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ItensVendas] CHECK CONSTRAINT [FK_ItensVendas_Vendas_VendaCodigo]
GO
