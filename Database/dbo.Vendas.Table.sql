USE [SoftLineDB]
GO
/****** Object:  Table [dbo].[Vendas]    Script Date: 27/02/2026 23:27:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Vendas](
	[Codigo] [int] IDENTITY(1,1) NOT NULL,
	[ClienteCodigo] [int] NOT NULL,
	[Data] [datetime2](7) NOT NULL,
	[Total] [decimal](18, 2) NOT NULL,
	[UsuarioId] [int] NULL,
 CONSTRAINT [PK_Vendas] PRIMARY KEY CLUSTERED 
(
	[Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Index [IX_Vendas_ClienteCodigo]    Script Date: 27/02/2026 23:27:10 ******/
CREATE NONCLUSTERED INDEX [IX_Vendas_ClienteCodigo] ON [dbo].[Vendas]
(
	[ClienteCodigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Vendas]  WITH CHECK ADD  CONSTRAINT [FK_Vendas_Clientes_ClienteCodigo] FOREIGN KEY([ClienteCodigo])
REFERENCES [dbo].[Clientes] ([Codigo])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Vendas] CHECK CONSTRAINT [FK_Vendas_Clientes_ClienteCodigo]
GO
ALTER TABLE [dbo].[Vendas]  WITH CHECK ADD  CONSTRAINT [FK_Vendas_Usuario] FOREIGN KEY([UsuarioId])
REFERENCES [dbo].[Usuarios] ([Id])
GO
ALTER TABLE [dbo].[Vendas] CHECK CONSTRAINT [FK_Vendas_Usuario]
GO
