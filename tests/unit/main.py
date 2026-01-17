import os
import argparse
from infra_terraform import TerraformExecutor

def parse_args():
    parser = argparse.ArgumentParser(description='Execute Terraform commands')
    parser.add_argument('--action', type=str, required=True, help='Terraform action to execute (e.g. init, plan, apply)')
    parser.add_argument('--env', type=str, required=True, help='Environment to target (e.g. dev, prod)')
    parser.add_argument('--dir', type=str, default='./terraform', help='Directory containing Terraform configuration')
    return parser.parse_args()

def main():
    args = parse_args()
    executor = TerraformExecutor(args.dir, args.env)
    if args.action == 'init':
        executor.init()
    elif args.action == 'plan':
        executor.plan()
    elif args.action == 'apply':
        executor.apply()
    else:
        raise ValueError(f'Unsupported action: {args.action}')

if __name__ == '__main__':
    main()