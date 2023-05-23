USE [DEVDFNBK]
GO

/****** Object:  StoredProcedure [dbo].[USP_ADD_PRODUCT]    Script Date: 4/16/2021 3:04:07 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[USP_ADD_PRODUCT] 
(
	@descriptionEn varchar(100), 
	@descriptionAr varchar(100),
	@status int,
	@group int,
	@subGroup int,
	@fees NVARCHAR(MAX),
	@isSuccess bit OUTPUT
)
AS
BEGIN
	BEGIN TRANSACTION;
	SAVE TRANSACTION InitialState;

	DECLARE @InsertedProductID  int;

	BEGIN TRY
		INSERT INTO PRODUCTS (DESCRIPTION_EN, DESCRIPTION_AR, STATUS, GROUP_ID, SUB_GROUP_ID) VALUES (@descriptionEn, @descriptionAr, @status, @group, @subGroup);
		SET @InsertedProductID = SCOPE_IDENTITY();

		INSERT INTO PRODUCT_FEE (PRODUCT_ID, PERIOD_ID, FEE) 
		SELECT PRODUCT_ID = @InsertedProductID, PERIOD_ID, FEE FROM OPENJSON(@fees)
		WITH (
			PERIOD_ID INT '$.period',
			FEE INT '$.fee'
		); 

		SET @isSuccess = 1;

        COMMIT TRANSACTION 
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
        BEGIN
			SET @isSuccess = 0;

            ROLLBACK TRANSACTION InitialState;
        END
	END CATCH
END
RETURN @isSuccess
GO


