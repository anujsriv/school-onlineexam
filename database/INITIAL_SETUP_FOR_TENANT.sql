USE [osms_arohan]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[OSMS_ANSWER](
	[id] [int] NOT NULL,
	[ANSWER] [ntext] NULL,
	[ANSWER_PAPER_ID] [int] NULL,
	[QUESTION_ID] [int] NULL,
	[CORRECT_INCORRECT] [nvarchar](max) NULL,
	[MARKS_OBTAINED] [int] NULL,
	[IMAGE_PATH] [ntext] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-----------------------------------------------------------------------------------------------------------------------

USE [osms_arohan]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[OSMS_ANSWER_PAPER](
	[id] [int] NOT NULL,
	[QUESTION_PAPER_ID] [int] NULL,
	[STATUS] [varchar](255) NULL,
	[STUDENT_ID] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

-----------------------------------------------------------------------------------------------------------------------

USE [osms_arohan]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[OSMS_PROCTING_URL](
	[id] [int] NOT NULL,
	[CLASS] [varchar](255) NULL,
	[SECTION] [varchar](255) NULL,
	[USER_NAME] [varchar](255) NULL,
	[VIDEO_URL] [ntext] NULL,
	[USER_TYPE] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-----------------------------------------------------------------------------------------------------------------------

USE [osms_arohan]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[OSMS_QUESTION](
	[id] [int] NOT NULL,
	[IMAGE_PATH] [varchar](255) NULL,
	[MARKS] [varchar](255) NULL,
	[OPTIONS] [ntext] NULL,
	[QUESTION] [ntext] NULL,
	[QUESTION_PAPER_ID] [int] NULL,
	[RIGHT_ANSWERS] [varchar](255) NULL,
	[TYPE] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-----------------------------------------------------------------------------------------------------------------------

USE [osms_arohan]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[OSMS_QUESTION_PAPER](
	[id] [int] NOT NULL,
	[CLASS] [varchar](255) NULL,
	[DURATION] [int] NULL,
	[EVALUATION_TYPE] [varchar](255) NULL,
	[FULL_MARKS] [float] NULL,
	[INSTRUCTIONS] [ntext] NULL,
	[LANGUAGE] [varchar](255) NULL,
	[NUMBER_OF_QUESTIONS] [int] NULL,
	[PASS_MARKS] [float] NULL,
	[SECTION] [varchar](255) NULL,
	[STATUS] [varchar](255) NULL,
	[SUBJECT] [varchar](255) NULL,
	[CREATED_BY] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

-----------------------------------------------------------------------------------------------------------------------

USE [osms_arohan]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[OSMS_USER](
	[id] [int] NOT NULL,
	[CLASS_NAME] [varchar](255) NULL,
	[FULL_NAME] [varchar](255) NULL,
	[LOGGED_IN] [bit] NULL,
	[PASSWORD] [varchar](255) NULL,
	[SECTION] [varchar](255) NULL,
	[TYPE] [varchar](255) NULL,
	[USER_NAME] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
