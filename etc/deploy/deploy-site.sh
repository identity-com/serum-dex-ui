#!/usr/bin/env bash
set -e
set -u

if [ "${STAGE}" == "prod" ]; then
  DISTRIBUTION=???
  BUCKET=dex.civic.finance
elif [ ${STAGE} == "preprod" ]; then
  DISTRIBUTION=E3LJR62KNBES5X
  BUCKET=dex-preprod.civic.finance
elif [ ${STAGE} == "dev" ]; then
  DISTRIBUTION=E2Q5JF0MXRHD4W
  BUCKET=dex-dev.civic.finance
elif [ ${STAGE} == "cryptid" ]; then
  DISTRIBUTION=E16POK0YNJGU3I
  BUCKET=dex-cryptid.civic.finance
fi

npx deploy-aws-s3-cloudfront --non-interactive --react --bucket ${BUCKET} --destination ${STAGE} --distribution ${DISTRIBUTION}

