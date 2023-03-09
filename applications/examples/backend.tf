terraform {
    required_providers {
        aws = {
        source  = "hashicorp/aws"
        version = "~> 4.16"
        }
    }

    required_version = ">= 1.1.0"
}

provider "aws" {
  region  = "ap-southeast-2"
}


terraform {
    backend "s3" {
        encrypt              = true
        bucket               = "petlover-tf-state-test"
        region               = "ap-southeast-2"
        key                  = "example-tf.tfstate"
        # profile              = "default"
    }
}
