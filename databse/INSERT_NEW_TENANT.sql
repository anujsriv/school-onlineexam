USE [osms_common]
GO

INSERT INTO [dbo].[OSMS_SCHOOL_TENANTID]
           ([id]
           ,[SCHOOL_NAME]
           ,[TENANT_ID])
     VALUES
           ((select max(id) from OSMS_SCHOOL_TENANTID)+1
           ,'SCHOOL_NAME'
           ,'TENANT_ID')
GO