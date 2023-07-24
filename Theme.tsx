import {
  Comment,
  DeclarationReflection,
  DefaultTheme,
  DefaultThemeRenderContext,
  JSX,
  Options,
  PageEvent,
  ReferenceType,
  Reflection,
  ReflectionFlags,
  ReflectionType,
  SignatureReflection,
  TypeParameterReflection,
} from 'typedoc';

function hasTypeParameters(reflection: Reflection): reflection is Reflection & {typeParameters: TypeParameterReflection[]} {
  return (
    (reflection instanceof DeclarationReflection || reflection instanceof SignatureReflection) &&
    reflection.typeParameters != null &&
    reflection.typeParameters.length > 0
  );
}

function renderFlags(flags: ReflectionFlags, comment: Comment | undefined): JSX.Element {
  const allFlags = [...flags];
  if (comment) {
    allFlags.push(...Array.from(comment.modifierTags, tag => tag.replace(/@([a-z])/, x => x[1].toUpperCase())));
  }

  return (
    <>
      {allFlags.map(item => (
        <>
          <code class={'tsd-tag ts-flag' + item}>{item}</code>{' '}
        </>
      ))}
    </>
  );
}

class ReferenceThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, page: PageEvent<Reflection>, options: Options) {
    super(theme, page, options);
  }

  override memberSignatureBody = (props: SignatureReflection, {hideSources = false}: {hideSources?: boolean} = {}) => {
    const returnsTag = props.comment?.getTag('@returns');

    return (
      <>
        {renderFlags(props.flags, props.comment)}
        {this.commentSummary(props)}

        {hasTypeParameters(props) && this.typeParameters(props.typeParameters)}

        {props.parameters && props.parameters.length > 0 && (
          <div class="tsd-parameters">
            <h4 class="tsd-parameters-title">Parameters</h4>
            <ul class="tsd-parameter-list">
              {props.parameters.map(item => (
                <li>
                  <h5>
                    {renderFlags(props.flags, props.comment)}
                    {!!item.flags.isRest && <span class="tsd-signature-symbol">...</span>}
                    <span class="tsd-kind-parameter">{item.name}</span>
                    {': '}
                    {this.type(item.type)}
                    {item.defaultValue != null && (
                      <span class="tsd-signature-symbol">
                        {' = '}
                        {item.defaultValue}
                      </span>
                    )}
                  </h5>
                  {this.commentSummary(item)}
                  {renderFlags(props.flags, props.comment)}
                  {item.type instanceof ReflectionType && this.parameter(item.type.declaration)}
                </li>
              ))}
            </ul>
          </div>
        )}
        {props.type && (
          <>
            <h4 class="tsd-returns-title">
              {'Returns '}
              {this.type(props.type)}
            </h4>
            {returnsTag && <JSX.Raw html={this.markdown(returnsTag.content)} />}
            {(props.type instanceof ReflectionType && this.parameter(props.type.declaration)) ||
              (props.type instanceof ReferenceType &&
                props.type.typeArguments?.[0] instanceof ReflectionType &&
                this.parameter((props.type.typeArguments?.[0]).declaration))}
          </> // added referenceType's reflection declaration from memberSignatureBody
        )}

        {this.commentTags(props)}
        {!hideSources && this.memberSources(props)}
      </>
    );
  };
}

export class ReferenceTheme extends DefaultTheme {
  private _contextCache?: ReferenceThemeContext;
  override getRenderContext(pageEvent: PageEvent<Reflection>): ReferenceThemeContext {
    this._contextCache ||= new ReferenceThemeContext(this, pageEvent, this.application.options);

    return this._contextCache;
  }
}
