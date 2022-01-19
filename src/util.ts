import { DMMF } from '@prisma/generator-helper'
import type { CodeBlockWriter } from 'ts-morph'
import { Config } from './config'

export const writeArray = (writer: CodeBlockWriter, array: string[], newLine = true) =>
	array.forEach((line) => writer.write(line).conditionalNewLine(newLine))

export const useModelNames = ({ modelCase, modelSuffix, relationModel }: Config) => {
	const formatModelName = (name: string, prefix = '') => {
		if (modelCase === 'camelCase') {
			name = name.slice(0, 1).toLowerCase() + name.slice(1)
		}
		return `${prefix}${name}${modelSuffix}`
	}

	return {
		modelName: (name: string) => formatModelName(name, relationModel === 'default' ? '_' : ''),
		relatedModelName: (name: string | DMMF.SchemaEnum | DMMF.OutputType | DMMF.SchemaArg) =>
			formatModelName(
				relationModel === 'default' ? name.toString() : `Related${name.toString()}`
			),
	}
}

export const needsRelatedModel = (model: DMMF.Model, config: Config) =>
	model.fields.some((field) => field.kind === 'object') && config.relationModel !== false
