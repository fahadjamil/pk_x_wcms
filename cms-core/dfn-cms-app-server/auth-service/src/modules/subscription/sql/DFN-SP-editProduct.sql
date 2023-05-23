USE [DEVDFNBK]
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROCEDURE [dbo].[USP_EDIT_PRODUCT] 
(
	@descriptionEn varchar(100), 
	@descriptionAr varchar(100),
	@status int,
	@group int,
	@subGroup int,
	@productId int,
	@fees NVARCHAR(MAX),
	@isSuccess bit OUTPUT
)
AS
BEGIN
	BEGIN TRANSACTION;
	SAVE TRANSACTION InitialState;

	DECLARE @AllFees NVARCHAR(MAX);

	BEGIN TRY
		UPDATE PRODUCTS SET DESCRIPTION_EN = @descriptionEn, DESCRIPTION_AR = @descriptionAr, STATUS = @status, GROUP_ID = @group, SUB_GROUP_ID = @subGroup WHERE PRODUCT_ID = @productId;

		MERGE PRODUCT_FEE AS TARGET
		USING (
			SELECT * FROM OPENJSON( @fees ) WITH (
				PRODUCT_ID int '$.product',
				PERIOD_ID int '$.period',
				FEE int '$.fee',
				FEE_ID int '$.feeId'
			)
		) AS SOURCE
		ON
			(TARGET.FEE_ID = SOURCE.FEE_ID)
			WHEN MATCHED
				THEN UPDATE SET TARGET.FEE = SOURCE.FEE, TARGET.PERIOD_ID = SOURCE.PERIOD_ID
			WHEN NOT MATCHED
				THEN INSERT (PRODUCT_ID, PERIOD_ID, FEE) VALUES (SOURCE.PRODUCT_ID, SOURCE.PERIOD_ID, SOURCE.FEE);

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


