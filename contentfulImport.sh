#!/usr/bin/env bash
for filename in ./nuxt-imports/*.json; do
	contentful space import --content-file $filename
done