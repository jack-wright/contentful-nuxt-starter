#!/usr/bin/env bash
for filename in ./nuxt-exports/*.json; do
	contentful space export --config $filename
done