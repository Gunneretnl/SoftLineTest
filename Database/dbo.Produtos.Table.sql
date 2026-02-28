USE [SoftLineDB]
GO
/****** Object:  Table [dbo].[Produtos]    Script Date: 27/02/2026 23:27:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Produtos](
	[Codigo] [int] IDENTITY(1,1) NOT NULL,
	[Descricao] [nvarchar](60) NOT NULL,
	[CodigoBarras] [nvarchar](14) NOT NULL,
	[ValorVenda] [decimal](18, 2) NOT NULL,
	[PesoBruto] [decimal](18, 3) NOT NULL,
	[PesoLiquido] [decimal](18, 3) NOT NULL,
 CONSTRAINT [PK_Produtos] PRIMARY KEY CLUSTERED 
(
	[Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
